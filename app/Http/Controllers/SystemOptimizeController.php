<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class SystemOptimizeController extends Controller
{
    /**
     * Rate limit key for optimize requests
     */
    private const RATE_LIMIT_KEY = 'system-optimize';

    /**
     * Maximum number of optimize requests per hour per user
     */
    private const RATE_LIMIT_ATTEMPTS = 3;

    /**
     * Execute artisan optimize command
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function optimize(Request $request): JsonResponse
    {
        // Validate request
        $request->validate([
            'confirm' => ['required', 'boolean', 'accepted'],
        ]);

        $user = Auth::user();

        // Check rate limiting
        $this->checkRateLimit($user);

        try {
            // Log the optimize request
            Log::info('System optimize requested', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString(),
            ]);

            // Execute artisan optimize command
            $exitCode = Artisan::call('optimize');

            if ($exitCode === 0) {
                $output = Artisan::output();

                // Log successful optimization
                Log::info('System optimize completed successfully', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'output' => $output,
                    'timestamp' => now()->toISOString(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'System optimized successfully',
                    'output' => $output,
                    'timestamp' => now()->toISOString(),
                ]);
            } else {
                $error = Artisan::output();

                // Log optimization failure
                Log::error('System optimize failed', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'exit_code' => $exitCode,
                    'error' => $error,
                    'timestamp' => now()->toISOString(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'System optimization failed',
                    'error' => $error,
                    'timestamp' => now()->toISOString(),
                ], 500);
            }
        } catch (\Exception $e) {
            // Log exception
            Log::error('System optimize exception', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'timestamp' => now()->toISOString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during system optimization',
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Get optimization status and last optimization info
     *
     * @return JsonResponse
     */
    public function status(): JsonResponse
    {
        $user = Auth::user();

        // Get last optimization log entry
        $lastOptimizeLog = $this->getLastOptimizeLog();

        // Check if user can optimize (only rate limited, no permission check)
        $canOptimize = !$this->isRateLimited($user);

        return response()->json([
            'can_optimize' => $canOptimize,
            'last_optimization' => $lastOptimizeLog,
            'rate_limit_remaining' => $this->getRateLimitRemaining($user),
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * Check if user is rate limited for optimize requests
     *
     * @param $user
     * @return bool
     */
    private function isRateLimited($user): bool
    {
        return RateLimiter::tooManyAttempts(
            self::RATE_LIMIT_KEY . ':' . $user->id,
            self::RATE_LIMIT_ATTEMPTS
        );
    }

    /**
     * Check rate limit and throw exception if exceeded
     *
     * @param $user
     * @throws ValidationException
     */
    private function checkRateLimit($user): void
    {
        if ($this->isRateLimited($user)) {
            $seconds = RateLimiter::availableIn(self::RATE_LIMIT_KEY . ':' . $user->id);

            Log::warning('System optimize rate limit exceeded', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'seconds_remaining' => $seconds,
                'timestamp' => now()->toISOString(),
            ]);

            throw ValidationException::withMessages([
                'optimize' => [
                    'Too many optimization requests. Please try again in ' .
                    ceil($seconds / 60) . ' minutes.'
                ],
            ]);
        }

        // Hit the rate limiter
        RateLimiter::hit(self::RATE_LIMIT_KEY . ':' . $user->id, 3600); // 1 hour
    }

    /**
     * Get remaining rate limit attempts
     *
     * @param $user
     * @return int
     */
    private function getRateLimitRemaining($user): int
    {
        $remaining = RateLimiter::remaining(
            self::RATE_LIMIT_KEY . ':' . $user->id,
            self::RATE_LIMIT_ATTEMPTS
        );

        return max(0, $remaining);
    }

    /**
     * Get last optimization log entry
     *
     * @return array|null
     */
    private function getLastOptimizeLog(): ?array
    {
        try {
            // Try to read from Laravel log file
            $logFile = storage_path('logs/laravel.log');
            if (!file_exists($logFile)) {
                return null;
            }

            $content = file_get_contents($logFile);
            $lines = array_reverse(explode("\n", $content));

            foreach ($lines as $line) {
                if (strpos($line, 'System optimize completed successfully') !== false ||
                    strpos($line, 'System optimize failed') !== false) {
                    // Parse log entry to extract relevant info
                    if (preg_match('/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z)\]/', $line, $matches)) {
                        return [
                            'timestamp' => $matches[1],
                            'status' => strpos($line, 'completed successfully') !== false ? 'success' : 'failed',
                            'message' => trim($line)
                        ];
                    }
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Failed to read optimization log', [
                'error' => $e->getMessage(),
                'timestamp' => now()->toISOString(),
            ]);
            return null;
        }
    }
}
