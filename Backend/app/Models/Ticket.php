<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'category',
        'created_by',
        'assigned_to',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function ticketHistories()
    {
        return $this->hasMany(TicketHistories::class);
    }
    public function assignedToUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
