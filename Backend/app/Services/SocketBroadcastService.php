<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SocketBroadcastService
{
    public function broadcast($payload)
    {
        try {
            $socketBridgeUrl = config('services.socket_bridge.url', 'http://localhost:3000');

            Http::timeout(3)
                ->post("{$socketBridgeUrl}/broadcast", $payload);

        } catch (\Exception $e) {
            Log::warning('Socket bridge broadcast failed', [
                'error' => $e->getMessage(),
                'payload' => $payload,
            ]);
        }
    }
}
