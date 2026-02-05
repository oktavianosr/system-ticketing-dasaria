<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketHistories extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'changed_by',
        'field_changed',
        'old_value',
        'new_value',
        'created_at',
        'status',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
