<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

trait ApiResponseTrait
{
    protected function ok(string $message, $data = [], int $code = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    /**
     * Return an error JSON response.
     */
    protected function error(string $message, $error = null, int $code = 500): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'error'   => $error,
        ], $code);
    }

    protected function download(string $document_path, $filename, $disk='public'):BinaryFileResponse
    {
        return response()->download(
            Storage::disk($disk)->path($document_path),
            $filename
        );
    }

}
