<?php

namespace App\Repositories;

use App\Models\Ticket;
use App\Services\TicketService;

class TicketRepository
{
    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function getAllTickets($params = [])
    {
        $fields = ["id", "title", "description", "priority", "status", "category", "created_by", "created_at", "updated_at"];

        return $this->ticketService->getAllTickets($fields, $params);
    }
}