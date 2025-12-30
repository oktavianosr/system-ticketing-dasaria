<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResources;
use App\Services\AuthenticationService;

class AuthenticationController extends Controller
{
    protected $authenticationService;

    public function __construct(AuthenticationService $authenticationService)
    {
        $this->authenticationService = $authenticationService;
    }

    public function login(Request $request)
    {
        try {
            $result = $this->authenticationService->login($request->only('email', 'password'));

            if (!$result) {
                return response()->json([
                    "success" => false,
                    "message" => "The provided credentials do not match our records.",
                    "data" => null,
                ], Response::HTTP_UNAUTHORIZED);
            }

            return response()->json([
                "success" => true,
                'message' => 'Login Succesful',
                'data' => [
                    'token' => $result['token'],
                    'user' => new UserResources($result['user']),
                ]
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Something went wrong",
                "data" => null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function logout(Request $request)
    {
        try {
            $this->authenticationService->logout(Auth::user());

            return response()->json([
                "success" => true,
                'message' => 'Logout Successful',
                'data' => null,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => 'Something went wrong',
                'data' => null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $this->authenticationService->me();

            return response()->json([
                "success" => true,
                'message' => 'User fetched successfully',
                'data' => new UserResources($user),
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                'message' => 'Something went wrong',
                'data' => null,
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
