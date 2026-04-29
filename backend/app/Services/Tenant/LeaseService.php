<?php

namespace App\Services\Tenant;

use App\Models\Lease;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Throwable;

class LeaseService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function find()
    {
        try{
            $data = Lease::where('tenant_id',Auth::id())
            ->active()
            ->firstOrFail();
            return $this->ok('Success!', $data);
        } catch(Throwable $t) {
            return $this->error('Failed to find lease', $t->getMessage());
        }
    }


    public function downloadLease()
    {
        try{
            $data = Lease::where('tenant_id',Auth::id())
            ->active()
            ->firstOrFail();
            if (!$data->document_path) {
                return $this->error('No document available for this lease.', null, 404);
            }
            if (!Storage::disk('public')->exists($data->document_path)) {
                return $this->error('Document file not found.', null, 404);
            }
            return $this->download(
                Storage::disk('public')->path($data->document_path),
                'lease-agreement.pdf'
            );
        } catch(Throwable $t) {
            return $this->error('Failed to find lease', $t->getMessage());
        }
    }
}
