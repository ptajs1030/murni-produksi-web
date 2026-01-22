<?php
use App\Enums\ToastType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

if (! function_exists('toast')) {
    function toast(ToastType $type, string $message, ?RedirectResponse $response = null)
    {
        $toasts = session()->get('toasts', []);
        $toasts[] = [
            'id' => Str::uuid(),
            'type' => $type->value,
            'message' => $message,
        ];
        if ($response) {
            return $response->with('toasts', $toasts);
        } else {
            session()->flash('toasts', $toasts);
        }
    }
}

if (! function_exists('toast_success')) {
    function toast_success(string $message)
    {
        return toast(ToastType::SUCCESS, $message);
    }
}

if (! function_exists('toast_warning')) {
    function toast_warning(string $message)
    {
        return toast(ToastType::WARNING, $message);
    }
}

if (! function_exists('toast_error')) {
    function toast_error(string $message)
    {
        return toast(ToastType::ERROR, $message);
    }
}
