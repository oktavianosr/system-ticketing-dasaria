<?php

namespace App\Http\Enums;

enum TicketStatus: string
{
    case OPEN = 'open';
    case IN_PROGRESS = 'in_progress';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    public function getLabel(): string
    {
        return match ($this) {
            TicketStatus::OPEN => 'Open',
            TicketStatus::RESOLVED => 'Escalated',
            TicketStatus::CLOSED => 'Closed',
            TicketStatus::IN_PROGRESS => 'In Progress',
        };
    }
}
