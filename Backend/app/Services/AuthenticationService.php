<?php

namespace App\Services;

use App\Repositories\AuthenticationRepository;
use Illuminate\Support\Facades\Auth;

class AuthenticationService
{
    protected $authenticationRepository;

    public function __construct(AuthenticationRepository $authenticationRepository)
    {
        $this->authenticationRepository = $authenticationRepository;
    }

    public function login($data)
    {
        if (! Auth::guard('web')->attempt($data)) {
            return null;
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout($user)
    {
        return $this->authenticationRepository->deleteCurrentToken($user);
    }

    public function me()
    {
        return Auth::user();
    }
}
