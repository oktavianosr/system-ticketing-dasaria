<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;
use App\Models\User;

class AuthenticationRepository
{
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function login($data)
    {
        $credentials = [
            'email' => $data["email"],
            'password' => $data["password"],
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json([
                "message" => "The provided credentials do not match our records.",
            ], Response::HTTP_UNAUTHORIZED);
        }

        request()->session()->regenerate();

        $user = Auth::user();

        return response()->json([
            "message" => "login successful",
            "user" => new UserResource($user->load('role')),
        ], Response::HTTP_OK);


    }
}