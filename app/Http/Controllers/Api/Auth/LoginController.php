<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends BaseApiController
{
    /**
     * Login
     *
     * Authenticate user and retrieve a sanctum bearer token.
     *
     * @tags Authentication
     * @unauthenticated
     * @bodyParam email string required User email address. Example: admin@murni.com
     * @bodyParam password string required User password. Example: password
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Login berhasil",
     *   "data": {
     *     "token": "1|abcde12345",
     *     "username": "Admin",
     *     "id": 1,
     *     "role": "admin"
     *   }
     * }
     * @response 401 scenario="Invalid credentials" {
     *   "success": false,
     *   "message": "Invalid login details",
     *   "data": null
     * }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->success(
                data: [
                    'token' => $token,
                    'username' => $user->name,
                    'id' => $user->id,
                    'role' => $user->role ?? 'user',
                ],
                message: 'Login berhasil',
                status: 200
            );
        }

        return $this->error(
            message: 'Invalid login details',
            status: 401
        );
    }

    /**
     * Logout
     *
     * Revoke the current user's bearer token.
     *
     * @tags Authentication
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "Successfully logged out",
     *   "data": null
     * }
     * @response 401 scenario="Unauthenticated" {
     *   "success": false,
     *   "message": "Unauthenticated.",
     *   "data": null
     * }
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            // Hapus token yang sedang digunakan
            $request->user()->currentAccessToken()->delete();
            
            // Atau hapus semua token (opsional)
            // $request->user()->tokens()->delete();

            return $this->success(
                data: null,
                message: 'Successfully logged out',
                status: 200
            );
        }

        return $this->error(
            message: 'Unauthenticated.',
            status: 401
        );
    }

    /**
     * Get authenticated user
     *
     * Retrieve the currently authenticated user's profile.
     *
     * @tags Authentication
     * @response 200 scenario="Success" {
     *   "success": true,
     *   "message": "User data retrieved successfully",
     *   "data": {
     *     "id": 1,
     *     "name": "Admin",
     *     "email": "admin@murni.com",
     *     "role": "admin",
     *     "created_at": "2024-01-01T00:00:00.000000Z"
     *   }
     * }
     */
    public function user(Request $request)
    {
        $user = $request->user();
        
        return $this->success(
            data: [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user',
                'created_at' => $user->created_at,
            ],
            message: 'User data retrieved successfully'
        );
    }
}