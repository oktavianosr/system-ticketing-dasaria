<?php

namespace App\Services;

use App\Repositories\TicketRepository;
use Illuminate\Support\Facades\DB;

class TicketService
{
    protected $ticketRepository;

    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    public function getAllTickets($params = [])
    {
        $user = auth()->user();

        return $this->ticketRepository->getAllTickets($params, $user);
    }

    public function getTicketById($id)
    {
        return $this->ticketRepository->getTicketById($id);
    }

    public function getComment($id)
    {
        return $this->ticketRepository->getComment($id);
    }

    public function addComment($id, $data)
    {
        $ticket = $this->ticketRepository->getTicketById($id);
        $user = auth()->user();

        $commentData = [
            'body' => $data['body'],
            'created_by' => $user->id,
            'ticket_id' => $ticket->id,
        ];

        DB::beginTransaction();
        try {
            $comment = $this->ticketRepository->addComment($ticket, $commentData);

            if (! empty($data['status'])) {
                if ($user->isAdmin() || ($user->isAgent() && $ticket->assigned_to == $user->id)) {
                    $this->ticketRepository->updateTicketStatus($ticket, $data['status']);
                }
            }

            DB::commit();

            return $comment;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateTicket($ticket, array $data)
    {
        DB::beginTransaction();
        try {
            $updatedTicket = $this->ticketRepository->update($ticket, $data);
            DB::commit();

            return $updatedTicket;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createTicket(array $data)
    {
        $user = auth()->user();

        if ($user->isAgent()) {
            throw new \Exception('You are not authorized to create ticket', 403);
        }

        $formattedData = [
            'created_by' => $user->id,
            'code' => 'TIC-'.rand(1000, 9999),
            'title' => $data['title'],
            'description' => $data['description'],
            'priority' => $data['priority'],
            'status' => $data['status'] ?? 'open',
        ];

        DB::beginTransaction();
        try {
            $ticket = $this->ticketRepository->create($formattedData);
            DB::commit();

            return $ticket;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function assignAgent($ticket, array $data)
    {
        $user = auth()->user();
        DB::beginTransaction();

        try {
            $oldAgent = $ticket->assigned_to;
            $newAgent = $data['assigned_to'];

            $assigner = $user->isAdmin() ? $user->id : $user->id;

            if ($oldAgent == $newAgent) {
                throw new \Exception('Ticket is already assigned to this agent', 403);
            }

            $ticket = $this->ticketRepository->assignAgent($ticket, [
                'assigned_to' => $newAgent,
                'assigned_by' => $assigner,
                'assigned_at' => now(),
            ]);

            DB::commit();

            return $ticket;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
