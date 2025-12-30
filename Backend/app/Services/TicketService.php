<?php

namespace App\Services;

use App\Models\Ticket;
use App\Repositories\TicketRepository;

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
}