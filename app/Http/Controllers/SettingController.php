<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => [
                'app_name' => AppSetting::get('app_name', 'Murni Produksi'),
                'app_logo' => AppSetting::get('app_logo'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        // Update app name
        AppSetting::set('app_name', $request->app_name);

        // Handle logo upload
        if ($request->hasFile('app_logo')) {
            // Delete old logo if exists
            $oldLogo = AppSetting::get('app_logo');
            if ($oldLogo) {
                $oldPath = str_replace('/storage/', '', $oldLogo);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new logo
            $path = $request->file('app_logo')->store('settings', 'public');
            AppSetting::set('app_logo', '/storage/' . $path);
        }

        toast_success('Pengaturan berhasil disimpan.');
        return redirect()->route('settings.index');
    }
}
