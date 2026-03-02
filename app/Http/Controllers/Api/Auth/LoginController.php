<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Api\BaseApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends BaseApiController
{
    /**
     * Handle login request
     * 
     * @param Request $request
     * @return JsonResponse
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
     * Handle logout request
     * 
     * @param Request $request
     * @return JsonResponse
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
     * Get authenticated user data
     * 
     * @param Request $request
     * @return JsonResponse
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