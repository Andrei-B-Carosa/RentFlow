<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnalayzeTranscriptRequest;
use App\Http\Requests\SaveMeetingRequest;
use App\Http\Requests\TranscribeRequest;
use App\Models\MeetingActionItem;
use App\Models\MeetingFollowUp;
use App\Models\MeetingNote;
use App\Services\GroqService;
use App\Services\MeetingAnalyzerService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MeetingController extends Controller
{
    public function index(Request $rq): JsonResponse
    {
        $data = MeetingNote::get();
        return response()->json($data);
    }

    public function show(int $id):JsonResponse
    {
        $data = MeetingNote::with(['actionItems','followUps'])->find($id);
        return response()->json($data);
    }

    public function toggleActionItem(Request $rq, int $id):JsonResponse
    {
        $rq->validate([
            'status'  => 'required|in:PENDING,CLOSED,CANCELLED',
            'remarks' => 'nullable|string',
        ]);
        $query = MeetingActionItem::find($id);
        $query->status = $rq->status;
        $query->remarks = $rq->remarks;
        $query->save();

        return response()->json(['status'=>$query->status]);
    }

    public function toggleFollowUp(Request $rq, int $id):JsonResponse
    {
        $rq->validate([
            'status'  => 'required|in:PENDING,CLOSED,CANCELLED',
            'remarks' => 'nullable|string',
        ]);
        $query = MeetingFollowUp::find($id);
        $query->status = $rq->status;
        $query->remarks = $rq->remarks;
        $query->save();

        return response()->json(['status'=>$query->status]);
    }


    public function transcribe(TranscribeRequest $rq, GroqService $groq): JsonResponse
    {
        $file  = $rq->file('audio');
        $store = $file->store('meetings', 'local');
        $path  = Storage::disk('local')->path($store);

        $transcript = $groq->transcribe($path);

        return response()->json([
            'transcript' =>$transcript,
            'audio_filename' =>$file->getClientOriginalName()
        ]);
    }


    public function analyze(AnalayzeTranscriptRequest $rq,MeetingAnalyzerService $service): JsonResponse
    {
        $result = $service->analyze($rq->transcript);
        return response()->json($result);
    }


    public function save(SaveMeetingRequest $rq): JsonResponse
    {
        try {
            DB::beginTransaction();
            $meeting = MeetingNote::create([
                'title'                  => $rq->title,
                'audio_filename'         => $rq->audio_filename,
                'transcript'             => $rq->transcript,
                'summary'                => $rq->summary,
                'key_points'             => $rq->key_points ?? [],
                'decisions'              => $rq->decisions ?? [],
                'minutes'                => $rq->minutes ?? [],
                'highlighted_transcript' => $rq->highlighted_transcript ?? '',
                'duration'               => $rq->duration,
            ]);

            //action items
            $actionItem = [];
            foreach ($rq->action_items ?? [] as $item) {
                $actionItem[] = [
                    'meeting_id' => $meeting->id,
                    'task'       => $item['task'],
                    'owner'      => $item['owner'] ?? null,
                    'deadline'   => $item['deadline'] ?? null,
                ];
            }

            //follow ups
            $followUps = [];
            foreach ($rq->follow_ups ?? [] as $followUp) {
                $followUps[] = [
                    'meeting_id'  => $meeting->id,
                    'description' => $followUp,
                ];
            }

            $meeting->actionItems()->createMany($actionItem);

            $meeting->followUps()->createMany($followUps);

            DB::commit();
            return response()->json([
                'message' => 'Meeting saved.',
                'id'      => $meeting->id,
            ]);

        } catch(Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Meeting not saved.',],500);
        }

    }
}
