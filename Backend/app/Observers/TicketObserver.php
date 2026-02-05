<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\TicketHistories;
use App\Models\User;

class TicketObserver
{
    public function updating(Ticket $ticket): void
    {
        if (auth()->check()) {
            $ticket->updated_by = auth()->user()->id;
        }
    }

    /**
     * Handle the Ticket "created" event.
     */
    public function created(Ticket $ticket): void
    {
        //
        $dirtyFields = $ticket->getDirty();

        foreach ($dirtyFields as $field => $newValue) {
            if ($field === 'updated_at') {
                continue;
            }

            $oldValue = $ticket->getOriginal($field);

            TicketHistories::create([
                'ticket_id' => $ticket->id,
                'changed_by' => $ticket->created_by,
                'status' => 'open',
                'field_changed' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
            ]);
        }
    }

    /**
     * Handle the Ticket "updated" event.
     */
    public function updated(Ticket $ticket): void
    {
        //
        $dirtyFields = $ticket->getDirty();

        $ignoredFields = ['updated_at', 'created_at'];
        foreach ($dirtyFields as $field => $newValue) {
            if (in_array($field, $ignoredFields)) {
                continue;
            }

            $oldValue = $ticket->getOriginal($field);
            if ($oldValue == $newValue) {
                continue;
            }

            $changedBy = auth()->check() ? auth()->id() : null;

            TicketHistories::create([
                'ticket_id' => $ticket->id,
                'changed_by' => $changedBy,
                'status' => $ticket->status,
                'field_changed' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
                'note' => $this->generateNote($field, $oldValue, $newValue),
            ]);
        }
    }

    protected function generateNote($field, $oldValue, $newValue): string
    {

        if ($field === 'assigned_to') {
            $oldAgent = $oldValue ? User::find($oldValue)?->name : 'Unassigned';
            $newAgent = $newValue ? User::find($newValue)?->name : 'Unassigned';

            return $oldValue
                ? "Re-assigned from {$oldAgent} to {$newAgent}"
                : "Assigned to {$newAgent}";
        }

        if ($field === 'status') {
            return "Status changed from '{$oldValue}' to '{$newValue}'";
        }

        if ($field === 'priority') {
            return "Priority changed from '{$oldValue}' to '{$newValue}'";
        }

        $fieldName = ucfirst(str_replace('_', ' ', $field));
        $oldVal = $oldValue ?? 'Not Set';
        $newVal = $newValue ?? 'Not Set';

        return "Changed {$fieldName} from '{$oldVal}' to '{$newVal}'";
    }

    /**
     * Handle the Ticket "deleted" event.
     */
    public function deleted(Ticket $ticket): void
    {
        //
        $dirtyFields = $ticket->getDirty();

        foreach ($dirtyFields as $field => $newValue) {
            if ($field === 'updated_at') {
                continue;
            }

            $oldValue = $ticket->getOriginal($field);

            TicketHistories::create([
                'ticket_id' => $ticket->id,
                'changed_by' => $ticket->created_by,
                'status' => $newValue,
                'field_changed' => $field,
                'old_value' => $oldValue,
                'new_value' => $newValue,
            ]);
        }
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
