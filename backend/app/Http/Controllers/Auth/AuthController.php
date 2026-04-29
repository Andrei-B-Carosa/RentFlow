<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest as Login;
use App\Http\Requests\Auth\ForgotPasswordRequest as ForgotPassword;
use App\Http\Requests\Auth\ResetPasswordRequest as ResetPassword;
use App\Http\Requests\Auth\RegisterRequest as Register;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Throwable;
use App\Traits\AuthResponseTrait;

class AuthController extends Controller
{
    use AuthResponseTrait, ApiResponseTrait;

    public function register(Register $rq):JsonResponse
    {
        try{
            DB::beginTransaction();
            $user = User::create([
                'name'=>$rq->name,
                'email'=>$rq->email,
                'password'=>$rq->password,
                'role'=>$rq->role,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();
            $this->authResponse($user,$token,201);
        } catch(Throwable $t) {
            DB::rollBack();
            return $this->error('Failed to register user',$t->getMessage());
        }
    }

    public function login(Login $rq):JsonResponse
    {
        try {
            $user = User::where('email', $rq->email)->first();
            if (! $user || ! Hash::check($rq->password, $user->password)) {
                $this->error('Invalid credentials',null, 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $this->authResponse($user,$token);
        } catch (Throwable $t) {
            $this->error('Failed to login user', $t->getMessage());
        }
    }

    public function forgotPassword(ForgotPassword $rq):JsonResponse
    {
        try {
            $status = Password::sendResetLink($rq->only('email'));
            $this->passwordResponse($status,($status === Password::RESET_LINK_SENT ? 200 : 422));
        } catch (Throwable $t) {
            $this->error('Failed to login user', $t->getMessage());
        }
    }

    public function resetPassword(ResetPassword $rq):JsonResponse
    {
        try {
            $status = Password::reset(
            $rq->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );
            $this->passwordResponse($status,($status === Password::PASSWORD_RESET ? 200 : 422));
        } catch (Throwable $t) {
            $this->error('Failed to login user', $t->getMessage());
        }
    }

    public function me(Request $rq):JsonResponse
    {
        return response()->json($rq->user());
    }

    public function logout(Request $rq):JsonResponse
    {
        $rq->user()->currentAccessToken()->delete();
        $this->ok('Logged out');
    }

    public function logoutAll(Request $rq):JsonResponse
    {
        $rq->user()->tokens()->delete();
        $this->ok('Logged out from all devices');
    }

    public function refresh(Request $rq):JsonResponse
    {
        $user = $rq->user();

        // Revoke current token and issue a fresh one
        $rq->user()->currentAccessToken()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->authResponse(null,$token);
    }
}
