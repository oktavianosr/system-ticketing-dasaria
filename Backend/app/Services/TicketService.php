<?php

namespace App\Services;

use App\Models\Ticket;
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

        // 1. Check Authorization
        if ($user->isCustomer() && $ticket->created_by != $user->id) {
            throw new \Exception("You are not authorized to comment on this ticket", 403);
        }

        // 2. Prepare Comment Data
        $commentData = [
            'body' => $data['body'],
            'created_by' => $user->id,
            'ticket_id' => $ticket->id,
        ];

        DB::beginTransaction();
        try {
            $comment = $this->ticketRepository->addComment($ticket, $commentData);

            if (!empty($data['status'])) {
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
}