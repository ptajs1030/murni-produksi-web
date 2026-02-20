<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users= User::query();
        if ($request->search) {
            $users->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->role) {
            $users->where('role', $request->role);
        }
        $perPage = $request->perPage ?: 10;
        $users = $users->paginate($perPage)->withQueryString();
        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'perPage']),
        ]);

    }

    public function store(Request $request)
    {
       try {
        DB::beginTransaction();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,operator',
        ],[
            'role.in' => 'Role harus diisi dengan nilai yang valid (admin atau operator).',
            'role.required' => 'Role harus diisi.',
            'name.required' => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'password.required' => 'Password harus diisi.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.min' => 'Password harus memiliki minimal 8 karakter.',
            'email.email' => 'Format email tidak valid.',
            'name.string' => 'Nama harus berupa teks.',
            'email.string' => 'Email harus berupa teks.',
            'password.string' => 'Password harus berupa teks.',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
        ]);

        DB::commit();
               toast_success('User berhasil ditambahkan.');

            return redirect()->route('users.index');
       } catch (\Exception $e) {
            DB::rollBack();
            toast_error('Gagal menyimpan data user: ' . $e->getMessage());
                return back()->withInput();
       }
    }

    public function update(Request $request, User $user)
    {
        try {
            DB::beginTransaction();
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'role' => 'required|string|in:admin,operator',
            ],[
                'role.in' => 'Role harus diisi dengan nilai yang valid (admin atau operator).',
                'role.required' => 'Role harus diisi.',
                'name.required' => 'Nama harus diisi.',
                'email.required' => 'Email harus diisi.',
                'email.unique' => 'Email sudah terdaftar.',
                'password.confirmed' => 'Konfirmasi password tidak sesuai.',
                'password.min' => 'Password harus memiliki minimal 8 karakter.',
                'email.email' => 'Format email tidak valid.',
                'name.string' => 'Nama harus berupa teks.',
                'email.string' => 'Email harus berupa teks.',
                'password.string' => 'Password harus berupa teks.',
            ]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }
            $user->role = $validated['role'];
            $user->save();

            DB::commit();
               toast_success('User berhasil diperbarui.');

            return redirect()->route('users.index');
       } catch (\Exception $e) {
            DB::rollBack();
            toast_error('Gagal memperbarui data user: ' . $e->getMessage());
                return back()->withInput();
       }
    }

    public function destroy(User $user)
    {
        try {
            $user->delete();
            toast_success('User berhasil dihapus.');
        } catch (\Exception $e) {
            toast_error('Gagal menghapus user: ' . $e->getMessage());
        }
        return redirect()->route('users.index');
    }
}
