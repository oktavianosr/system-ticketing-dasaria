<?php

namespace App\Repositories;

use App\Models\User;

class AuthenticationRepository
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function findByEmail(string $email)
    {
        return $this->user->where('email', $email)->first();
    }

    public function deleteCurrentToken(User $user)
    {
        return $user->currentAccessToken()->delete();
    }
}
