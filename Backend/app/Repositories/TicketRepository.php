<?php

namespace App\Repositories;

use App\Http\Enums\TicketStatus;
use App\Models\Ticket;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class TicketRepository extends BaseRepository
{
    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function getAllTickets($params, $user): LengthAwarePaginator
    {
        $user = Auth::user();
        $cacheKey = cache_key('tickets', 'list', [
            'user_id' => $user->id,
            'params' => $params
        ]);

        return Cache::tags(cache_tags('tickets', 'tickets:user:'.$user->id))->remember(
            $cacheKey,
            $this->cacheTtl,
            function () use ($params, $user) {
                $query = $this->ticket->select('*') // Select all fields by default
            ->with('comments');

                // Access Rights
                if ($user->isCustomer()) {
                    $query->where('created_by', $user->id);
                }
                // Admin and Agent allow all

                // Searching
                if (! empty($params['search'])) {
                    $query->where(function ($q) use ($params) {
                        $q->where('title', 'like', '%'.$params['search'].'%')
                            ->orWhere('description', 'like', '%'.$params['search'].'%');
                    });
                }

                // Filtering status/priority
                if (! empty($params['status'])) {
                    $query->where('status', $params['status']);
                }

                if (! empty($params['priority'])) {
                    $query->where('priority', $params['priority']);
                }

                // Custom sorting
                $allowedSortColumns = ['created_at', 'status', 'priority', 'title'];
                $sortBy = in_array($params['sort_by'] ?? '', $allowedSortColumns)
                          ? $params['sort_by']
                          : 'created_at';
                $sortOrder = $params['sort_order'] ?? 'desc';
                if (! in_array(strtolower($sortOrder), ['asc', 'desc'])) {
                    $sortOrder = 'desc';
                }

                $query->orderBy($sortBy, $sortOrder);

                // Pagination
                $pagination = $params['pagination'] ?? 10;

                return $query->paginate($pagination);
            }
        );
    }

    public function getTicketById($id)
    {
        return $this->ticket->with('comments')->findOrFail($id);
    }

    public function getComment($id)
    {
        return $this->ticket->with('comments')->findOrFail($id);
    }

    public function addComment($ticket, $data)
    {
        return $ticket->comments()->create($data);
    }

    public function updateTicketStatus($ticket, $status)
    {
        $ticket->status = $status;
        if ($status == TicketStatus::RESOLVED) {
            $ticket->completed_at = now();
        }
        $ticket->save();

        return $ticket;
    }

    public function update($ticket, array $data)
    {
        $ticket->update($data);

        return $ticket;
    }

    public function create(array $data)
    {
        return $this->ticket->create($data);
    }

    public function assignAgent($ticket, array $data)
    {
        $ticket->update([
            'assigned_to' => $data['assigned_to'],
            'assigned_at' => now(),
            'assigned_by' => $data['assigned_by'],
        ]);

        return $ticket->fresh();
    }
}
