const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: process.env.REACT_APP_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST']
    }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Webhook endpoint from Laravel
app.post('/broadcast', (req, res) => {
    try {
        const { event, data } = req.body;

        if (!event || !data) {
            return res.status(400).json({
                success: false,
                message: 'Missing event or data'
            });
        }

        // Broadcast to all connected clients
        io.emit(event, data);

        console.log(` Broadcasted event: ${event}`, {
            ticket_id: data.ticket_id,
            user: data.user?.name || data.user,
            clients: io.engine.clientsCount
        });

        res.json({
            success: true,
            message: 'Event broadcasted',
            clients: io.engine.clientsCount
        });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        clients: io.engine.clientsCount,
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket Bridge Server running on port ${PORT}`);
});