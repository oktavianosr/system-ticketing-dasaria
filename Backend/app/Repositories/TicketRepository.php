<?php

namespace App\Repositories;

use App\Models\Ticket;

class TicketRepository
{
    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function getAllTickets($params = [], $user)
    {
        $query = $this->ticket->select('*') // Select all fields by default
            ->with('comments');

        // Access Rights
        if ($user->isCustomer()) {
            $query->where('created_by', $user->id);
        }
        // Admin and Agent allow all

        // Searching
        if (!empty($params['search'])) {
            $query->where(function ($q) use ($params) {
                $q->where('title', 'like', '%' . $params['search'] . '%')
                    ->orWhere('description', 'like', '%' . $params['search'] . '%');
            });
        }

        // Filtering status/priority
        if (!empty($params["status"])) {
            $query->where("status", $params["status"]);
        }

        if (!empty($params["priority"])) {
            $query->where("priority", $params["priority"]);
        }

        // Custom sorting
        $sortBy = $params["sort_by"] ?? "created_at";
        $sortOrder = $params["sort_order"] ?? "desc";
        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $pagination = $params["pagination"] ?? 10;
        return $query->paginate($pagination);
    }

    public function getTicketById($id)
    {
        return $this->ticket->with('comments')->findOrFail($id);
    }

}