<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MeetingAnalyzerService
{
    private string $url;
    private string $key;
    private string $model;

    public function __construct()
    {
        $this->url   = config('openrouter.services.url');
        $this->key   = config('openrouter.services.key');
        $this->model = config('openrouter.services.model');
    }

    public function analyze(string $transcript)
    {
        $response = $this->call($transcript);

        $raw = $response->json()['choices'][0]['message']['content'] ?? '';

        return $this->clean($raw);
    }


    private function call(string $transcript)
    {
        $prompt = $this->buildPrompt($transcript);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->key,
            'Content-Type'  => 'application/json',
            'HTTP-Referer'  => 'http://localhost:5173',
            'X-Title'       => 'AI Meeting Notes',
        ])->post($this->url . '/chat/completions', [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional meeting analyst. You always respond in valid JSON only. No extra text, no markdown, no backticks.'],
                ['role' => 'user',   'content' => $prompt],
            ],
        ]);

        if ($response->failed()) {
            return $this->initResult();
        }

        return $response;
    }

    private function buildPrompt(string $transcript): string
    {
        return "Analyze this meeting transcript and return a JSON object with exactly these keys:
        {
        \"summary\": \"3-5 sentence overview of the meeting\",
        \"key_points\": [\"point 1\", \"point 2\"],
        \"decisions\": [\"decision 1\", \"decision 2\"],
        \"action_items\": [
            { \"task\": \"...\", \"owner\": \"...\", \"deadline\": \"...\" }
        ],
        \"follow_ups\": [\"follow up 1\", \"follow up 2\"],
        \"minutes\": {
            \"date\": \"...\",
            \"attendees\": [\"...\"],
            \"agenda\": [\"...\"],
            \"discussions\": [\"...\"],
            \"resolutions\": [\"...\"]
        },
        \"highlighted_transcript\": \"full transcript with [HIGHLIGHT] and [/HIGHLIGHT] tags around important parts\"
        }

        Rules:
        - Return valid JSON ONLY — no extra text, no markdown, no backticks
        - If a field has no data, return an empty array [] or empty string \"\"
        - owner and deadline in action_items can be empty string if not mentioned
        - Wrap important names, decisions, deadlines, and key phrases with [HIGHLIGHT][/HIGHLIGHT]

        Transcript:
        {$transcript}";
    }

    private function clean(string $raw):array
    {
        // strip accidental markdown backticks
        $clean = preg_replace('/```json|```/', '', $raw);
        $clean = trim($clean);

        $data = json_decode($clean, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->initResult();
        }

        return $data;

    }

    private function initResult():array
    {
        return [
            'summary'                => 'Analysis unavailable.',
            'key_points'             => [],
            'decisions'              => [],
            'action_items'           => [],
            'follow_ups'             => [],
            'minutes'                => [],
            'highlighted_transcript' => '',
        ];
    }

}
