<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\TicketHistories;

class TicketObserver
{
    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        //
        TicketHistories::create([
            'ticket_id' => $ticket->id,
            'changed_by' => $ticket->created_by,
            'field_changed' => 'created',
            'old_value' => null,
            'new_value' => 'New Ticket Created',
        ]);
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        //
        $dirtyFields = $ticket->getDirty();

        foreach ($dirtyFields as $field => $newValue) {
            if ($field === 'updated_at')
                continue;

            $oldValue = $ticket->getOriginal($field);

            TicketHistories::create([
                'ticket_id' => $ticket->id,
                'changed_by' => $ticket->created_by,
                'field_changed' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
            ]);
        }
    }

    /**
     * Handle the Ticket "deleted" event.
     */
    public function deleted(Ticket $ticket): void
    {
        //
        TicketHistories::create([
            'ticket_id' => $ticket->id,
            'changed_by' => $ticket->deleted_by,
            'field_changed' => 'deleted',
            'old_value' => null,
            'new_value' => $ticket->id,
        ]);
    }

    /**
     * Handle the Ticket "restored" event.
     */
    public function restored(Ticket $ticket): void
    {
        //
        TicketHistories::create([
            'ticket_id' => $ticket->id,
            'changed_by' => $ticket->restored_by,
            'field_changed' => 'restored',
            'old_value' => null,
            'new_value' => $ticket->id,
        ]);
    }

    /**
     * Handle the Ticket "force deleted" event.
     */
    public function forceDeleted(Ticket $ticket): void
    {
        //
        $ticket->deleted_by = null;
        $ticket->save();
        TicketHistories::create([
            'ticket_id' => $ticket->id,
            'changed_by' => $ticket->deleted_by,
            'field_changed' => 'force deleted',
            'old_value' => null,
            'new_value' => $ticket->id,
        ]);
    }
}
