<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get all users with agent role
     */
    public function getAgents()
    {
        return $this->user->where('role', 'agent')->get();
    }

    /**
     * Find user by ID
     */
    public function findById($id)
    {
        return $this->user->findOrFail($id);
    }

    /**
     * Update user profile
     */
    public function update(User $user, array $data)
    {
        $user->update($data);
        return $user->fresh();
    }
}