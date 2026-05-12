<?php

namespace App\Services\Landlord;

use App\Constants\Role;
use App\Helpers\DTServerSide;
use App\Mail\TenantWelcomeMail;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class TenantService
{
    use ApiResponseTrait;

    public function __construct()
    {
        //
    }

    public function table($rq)
    {
        $data = User::with(['leases' => function ($q) {
            $q->with('unit.property');
        }])
        ->active()
        ->where('role',Role::TENANT->value);
        // ->whereHas('leases.unit.property', function ($q) {
        //     $q->where('landlord_id', Auth::id());
        // });
        $searchableColumn = [
            'name',
            'email'
        ];
        $sortableColumn = [
            'id' => 'id'
        ];
        return (new DTServerSide($rq,$data,$searchableColumn,$sortableColumn))->renderTable();
    }

    public function find(string $id)
    {
        try{
            $data = User::with([
                'leases' => function ($q) {
                    $q->with([
                        'unit.property',
                        'payments' => function ($q) {
                            $q->orderBy('due_date', 'desc');
                        }
                    ]);
                },
                'maintenanceRequests' => function ($q) {
                    $q->orderBy('created_at', 'desc');
                }
            ])
            ->active()
            ->where('role',Role::TENANT->value)
            // ->whereHas('leases.unit.property', function ($q) {
            //     $q->where('landlord_id', Auth::id());
            // })
            ->findOrFail($id);
            return $this->ok('Success!',$data);
        } catch(Exception $e) {
            return $this->error('Failed to find tenant!',$e->getMessage(),404);
        }

    }

    public function create($rq)
    {
        try {
            DB::beginTransaction();
            $password = Str::random(8);
            $data = User::create([
                'name'=>$rq->name,
                'email'=>$rq->email,
                'password' => Hash::make($password), // store hashed
            ]);
            Mail::to($data->email)->send(new TenantWelcomeMail($data,$password));
            DB::commit();
            return $this->ok('User created successfully',null,201);
        } catch (Throwable $t) {
            DB::rollBack();
            return $this->error('Failed to create user',$t->getMessage(),500);
        }
    }

    public function update($rq, string $id)
    {
        try {
            DB::beginTransaction();
            $data = User::find($id);
            $data->update([
               'name'=>$rq->name,
               'email'=>$rq->email,
            ]);
            DB::commit();
            return $this->ok('User updated successfully');
        } catch (Throwable $t) {
            DB::rollBack();
            return $this->error('Failed to update user details',$t->getMessage(),500);
        }
    }

    public function delete(string $id)
    {
        try{
            DB::beginTransaction();
            $data = User::findOrFail($id);
            $hasActiveLease = $data->leases()->active()->exists();
            if($hasActiveLease){
                return $this->error('Tenant has a active lease', null, 422);
            }
            $data->delete();
            DB::commit();
            return $this->ok('Tenant deleted successfully');
        } catch(Throwable $t) {
            DB::rollback();
            return $this->error('Failed to delete tenant',$t->getMessage(),500);
        }
    }
}
