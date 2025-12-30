<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResources;

class AuthenticationController extends Controller
{
    public function login(Request $request)
    {
        try {
            if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
                return response()->json([
                    "message" => "The provided credentials do not match our records.",
                    "data" => null,
                ], Response::HTTP_UNAUTHORIZED);
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login Succesful',
                'data' => [
                    'token' => $token,
                    'user' => new UserResources($user),
                ]
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'data' => null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            $user->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout Successful',
                'data' => null,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'data' => null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = Auth::user();

            return response()->json([
                'message' => 'User fetched successfully',
                'data' => new UserResources($user),
            ], Response::HTTP_OK);


        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'data' => null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
