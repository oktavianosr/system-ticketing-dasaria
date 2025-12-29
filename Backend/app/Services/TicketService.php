<?php

namespace App\Services;

use App\Models\Ticket;
use App\Repositories\TicketRepository;

class TicketService
{
    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    public function getAllTickets($fields, $params = [])
    {
        $query = Ticket::select($fields)
            ->with('comments');

        //searching
        if (!empty($params['search'])) {
            $query->where(function ($q) use ($params) {
                $q->where('title', 'like', '%' . $params['search'] . '%')
                    ->orWhere('description', 'like', '%' . $params['search'] . '%');
            });
        }

        //filtering status/priority
        if (!empty($params["status"])) {
            $query->where("status", $params["status"]);
        }

        //custom sorting
        $sortBy = $params["sort_by"] ?? "created_at";
        $sortOrder = $params["sort_order"] ?? "desc";
        $query->orderBy($sortBy, $sortOrder);

        //pagination
        $pagination = $params["pagination"] ?? 10;
        return $query->paginate($pagination)->withQueryString();

    }

    public function getTicketById($id, $fields)
    {
        return Ticket::select($fields)->with('comments')->findOrFail($id);
    }
}