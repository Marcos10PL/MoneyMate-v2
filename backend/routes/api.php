<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
  return response()->json($request->user());
});

Route::prefix("auth")->group(function () {
  Route::middleware('guest')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
  });

  Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::delete('/delete', [RegisteredUserController::class, 'destroy'])
      ->name('delete');
  });
});

Route::middleware('auth:sanctum')->group(function () {
  Route::apiResource('categories', CategoryController::class)->only([
    'index',
    'store',
    'destroy',
  ]);

  Route::apiResource('transactions', TransactionController::class);

  Route::apiResource('types', TypeController::class)->only([
    'index',
  ]);

  Route::apiResource('accounts', AccountController::class);
});

// only for admin
Route::middleware(['auth:sanctum', 'role'])->group(function () {
  Route::apiResource('users', UserController::class)->only(['index', 'destroy']);
});