<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
   public function share(Request $request): array
{
    $settings = AppSetting::allCached();

    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => fn () => [
            'toasts' => $request->session()->get('toasts'),
        ],
        'appSettings' => [
            'name' => $settings['app_name'] ?? 'Murni Produksi',
            'logo' => $settings['app_logo'] ?? '/resources/img/logo.png',
        ],
    ]);
}

}

