<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResources;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResources($this->user),
            'code' => $this->code,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'assigned_to' => $this->assignedToUser ? new UserResources($this->assignedToUser) : null,
            'status' => $this->status ?? 'open',
            'category' => $this->category,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'comments' => $this->whenLoaded('comments', function () {
                return CommentResource::collection($this->comments);
            }),

            'comments_count' => $this->whenLoaded('comments', function () {
                return $this->comments->count();
            }),

        ];
    }
}
