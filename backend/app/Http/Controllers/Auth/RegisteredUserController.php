<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RegisteredUserController extends Controller
{
  /**
   * Handle an incoming registration request.
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function store(Request $request): JsonResponse
  {
    $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
      'password' => [
        'required',
        'confirmed',
        'min:8',
        'regex:/[a-z]/',
        'regex:/[A-Z]/',
        'regex:/[0-9]/',
        'regex:/[^a-zA-Z0-9]/',
      ],
      'role' => ['nullable', 'exists:' . Role::class . ',name'],
    ]);


    if (Auth::check() && Auth::user()->isAdmin() && $request->role) {
      $role = Role::where('name', $request->role)->first();
      $roleId = $role ? $role->id : Role::where('name', 'user')->first()->id;
    } else {
      $roleId = Role::where('name', 'user')->first()->id;
    }

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->string('password')),
      'role_id' => $roleId
    ]);

    event(new Registered($user));

    Auth::login($user);

    return response()->json([
      'message' => 'User registered successfully',
      'user' => [
        ...$user->toArray(),
        'role' => $user->role->name,
      ],
    ], Response::HTTP_CREATED);
  }

  public function destroy(Request $request): JsonResponse
  {
    $user = $request->user();
    $user->tokens()->delete();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
  }
}
