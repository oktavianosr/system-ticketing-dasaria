<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use App\Http\Resources\UserResources;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get all agents for assignment dropdown
     */
    public function getAgents()
    {
        try {
            $agents = $this->userService->getAgents();

            return response()->json([
                "success" => true,
                "message" => "Agents retrieved successfully",
                "data" => UserResources::collection($agents),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to get agents",
                "error" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update authenticated user's profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
            ]);

            $user = $this->userService->updateProfile($validated);

            return response()->json([
                "success" => true,
                "message" => "Profile updated successfully",
                "data" => new UserResources($user),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to update profile",
                "error" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Change authenticated user's password
     */
    public function changePassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $this->userService->changePassword($validated);

            return response()->json([
                "success" => true,
                "message" => "Password changed successfully",
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            $statusCode = $e->getCode() === 400 ? Response::HTTP_BAD_REQUEST : Response::HTTP_INTERNAL_SERVER_ERROR;
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
            ], $statusCode);
        }
    }
}
