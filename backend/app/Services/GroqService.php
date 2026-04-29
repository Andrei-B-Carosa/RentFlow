<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GroqService
{
    private string $key;
    private string $url;
    private string $model;

    public function __construct()
    {
        $this->key = config('groq.services.key');
        $this->url = config('groq.services.url');
        $this->model = config('groq.services.model');
    }

    public function transcribe(string $filePath): string
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->key,
        ])->attach(
            'file',
            file_get_contents($filePath),
            basename($filePath)
        )->post($this->url, [
            'model'           => $this->model,
            'response_format' => 'text',
        ]);

        if ($response->failed()) {
            return 'Transcription failed: ' . $response->body();
        }

        return $response->body();
    }
}
