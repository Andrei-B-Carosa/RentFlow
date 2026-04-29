<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenRouterService
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

    private function call(string $systemPrompt, string $userMessage): string
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->key,
            'Content-Type'  => 'application/json',
        ])->post($this->url . '/chat/completions', [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user',   'content' => $userMessage],
            ],
        ]);


        if ($response->failed()) {
            // return 'AI unavailable.';
            return 'Error: ' . $response->status() . ' — ' . $response->body();
        }

        return $response->json()['choices'][0]['message']['content'] ?? 'No response.';
    }

    private function questionPrompt(string $role, string $interviewType, string $difficulty, array $previousQuestions = []): string
    {
        $asked = empty($previousQuestions)
        ? ''
        : "\n\nQuestions already asked (DO NOT repeat or ask similar ones):\n- "
          . implode("\n- ", $previousQuestions);

        return "You are a strict technical interviewer.
        Generate exactly ONE interview question for the following:
        - Job Role: {$role}
        - Interview Type: {$interviewType}
        - Difficulty: {$difficulty}
        {$asked}

        Rules:
        - Return the question text ONLY
        - No numbering, no intro, no explanation
        - Make it specific and relevant to the role
        - Each question must test a DIFFERENT skill or topic";
    }

    private function evaluationPrompt(string $role, string $interviewType, string $difficulty): string
    {
        $rubric = match($difficulty) {
        'Easy' => "
        Scoring rubric — this is an EASY level interview, be LENIENT:
        - Pass    → Answer shows basic understanding. Partial knowledge is acceptable.
        - Partial → Answer is vague or missing some points but shows some awareness.
        - Fail    → Answer is completely wrong, blank, or totally irrelevant.",

        'Intermediate' => "
        Scoring rubric — this is an INTERMEDIATE level interview, be MODERATELY STRICT:
        - Pass    → Answer is correct and covers the main points clearly.
        - Partial → Answer is on the right track but missing important details.
        - Fail    → Answer is wrong, too vague, or shows very little understanding.",

        'Advanced' => "
        Scoring rubric — this is an ADVANCED level interview, be VERY STRICT:
        - Pass    → Answer is thorough, precise, and demonstrates deep understanding.
                    Must cover edge cases, trade-offs, or real-world application.
        - Partial → Answer is correct at a surface level but lacks depth or detail.
        - Fail    → Answer is vague, incomplete, or missing critical concepts.",

        default => ""
        };

        return "You are a strict and CONSISTENT interview evaluator.
        Evaluate the candidate's answer for the following:
        - Job Role: {$role}
        - Interview Type: {$interviewType}
        - Difficulty: {$difficulty}
        {$rubric}

        Return your response in this EXACT format (no extra text):
        VERDICT: Pass | Fail | Partial
        REASON: (one sentence explaining the verdict based on the difficulty level)
        SUGGESTED: (one to two sentences of a better answer appropriate for {$difficulty} level)

        Rules:
        - Apply the rubric consistently — same quality answer = same verdict every time
        - Adjust your expectations based on the difficulty level above
        - VERDICT must be exactly one of: Pass, Fail, Partial
        - Do not add anything outside the format above";
    }

    private function parseEvaluation(string $raw): array
    {
        $verdict  = 'Fail';
        $reason   = '';
        $suggested = '';

        // Extract each field from the formatted response
        if (preg_match('/VERDICT:\s*(Pass|Fail|Partial)/i', $raw, $m)) {
            $verdict = ucfirst(strtolower($m[1]));
        }

        if (preg_match('/REASON:\s*(.+?)(?=SUGGESTED:|$)/si', $raw, $m)) {
            $reason = trim($m[1]);
        }

        if (preg_match('/SUGGESTED:\s*(.+)/si', $raw, $m)) {
            $suggested = trim($m[1]);
        }

        return [
            'verdict'          => $verdict,
            'reason'           => $reason,
            'suggested_answer' => $suggested,
        ];
    }

    public function generateQuestion(string $role, string $interviewType, string $difficulty, array $previousQuestions = []): string
    {
        $system = $this->questionPrompt($role, $interviewType, $difficulty,$previousQuestions);
        $user   = "Generate the question now.";

        return $this->call($system, $user);
    }

    public function evaluateAnswer(string $question,string $answer,string $role, string $interviewType,string $difficulty): array {
        $system = $this->evaluationPrompt($role, $interviewType, $difficulty);
        $user   = "Question: {$question}\n\nCandidate Answer: {$answer}";

        $raw = $this->call($system, $user);

        return $this->parseEvaluation($raw);
    }


}
