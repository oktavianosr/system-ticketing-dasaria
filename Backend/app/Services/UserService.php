<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get all agents
     */
    public function getAgents()
    {
        return $this->userRepository->getAgents();
    }

    /**
     * Get user by ID
     */
    public function getUserById($id)
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Update user profile
     */
    public function updateProfile(array $data)
    {
        $user = auth()->user();
        $updateData = [];

        if (!empty($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (!empty($data['phone'])) {
            $updateData['phone'] = $data['phone'];
        }

        return $this->userRepository->update($user, $updateData);
    }

    /**
     * Change password
     */
    public function changePassword(array $data)
    {
        $user = auth()->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            throw new \Exception('Current password is incorrect', 400);
        }

        return $this->userRepository->update($user, [
            'password' => Hash::make($data['password'])
        ]);
    }
}
