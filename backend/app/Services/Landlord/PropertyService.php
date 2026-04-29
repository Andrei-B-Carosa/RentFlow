<?php

namespace App\Services\Landlord;

use App\Helpers\DTServerSide;
use App\Models\Property;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PropertyService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function datatable($rq)
    {
        $data = Property::where('landlord_id',Auth::id())->active();
        $searchableColumns = [
            'name',
        ];
        $sortableColumns = [
            'id'        => 'id',
        ];
        return (new DTServerSide($rq, $data, $searchableColumns, $sortableColumns))->renderTable();
    }

    public function create($rq)
    {
        try{
            DB::beginTransaction();
            $photoPaths = self::photoPaths($rq);
            $data = Property::create([
                'landlord_id' => Auth::id(),
                'name' =>$rq->name,
                'address' => $rq->address,
                'city'=> $rq->city,
                'description'=> $rq->description,
                'photos' => $photoPaths,
                'is_active'=> $rq->is_active,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Property created successfully!',
                'data' => $data
            ],201);
        } catch(Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to create property.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function find(string $id)
    {
        try{
            $data = Property::where('landlord_id', Auth::id())->active()->findOrFail($id);
            return response()->json([
                'message' => 'Success!',
                'data' => $data
            ]);
        } catch(Exception $e) {
            return response()->json([
                'message' => 'Property not found.'
            ],404);
        }
    }

    public function update(string $id,$rq)
    {
        try{
            DB::beginTransaction();
            $data = Property::where('landlord_id', Auth::id())->active()->findOrFail($id);
            $photoPaths = self::photoPaths($rq,$data->photos ?? []);
            $data->update([
                'name' => $rq->name,
                'address' => $rq->address,
                'city' => $rq->city,
                'description' => $rq->description,
                'photos' => $photoPaths,
                'is_active' => $rq->is_active,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Property updated successfully!',
            ]);
        } catch(Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to update property.',
                'error' => $e->getMessage()
            ],500);
        }
    }

    public function delete(string $id)
    {
        try{
            $data = Property::where('landlord_id', Auth::id())->active()->findOrFail($id);
            $data->delete();
            return response()->json([
                'message' => 'Property deleted successfully!',
            ]);
        } catch(Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to delete property.',
                'error' => $e->getMessage()
            ],500);
        }
    }

    private function photoPaths($rq,$photoPaths=[])
    {
        if ($rq->has('remove_photos') && !empty($photoPaths)) {
            foreach ($rq->remove_photos as $pathToRemove) {
                if (in_array($pathToRemove, $photoPaths)) {
                    Storage::disk('public')->delete($pathToRemove);
                    $photoPaths = array_filter($photoPaths,fn($p) => $p !== $pathToRemove);
                }
            }
            // re-index array after filter
            $photoPaths = array_values($photoPaths);
        }
        if ($rq->hasFile('photos')) {
            foreach ($rq->file('photos') as $photo) {
                $photoPaths[] = $photo->store('properties/photos', 'public');
            }
        }
        return $photoPaths;
    }
}
