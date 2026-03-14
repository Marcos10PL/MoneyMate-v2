<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
  public function index(Request $request)
  {
    $accounts = $request->user()->accounts;

    $result = $accounts->map(function ($account) {
      $income = (float) $account->transactions()
        ->whereHas('type', fn($q) => $q->where('name', 'income'))
        ->sum('amount');

      $expense = (float) $account->transactions()
        ->whereHas('type', fn($q) => $q->where('name', 'expense'))
        ->sum('amount');

      return [
        'id' => $account->id,
        'name' => $account->name,
        'income_sum' => round($income, 2),
        'expense_sum' => round($expense, 2),
        'balance' => round($income - $expense, 2),
      ];
    });

    return response()->json([
      'message' => 'Accounts retrieved successfully',
      'accounts' => $result,
    ]);
  }

  public function store(Request $request)
  {
    $userId = $request->user()->id;

    $request->validate([
      'name' => [
        'required',
        'string',
        'max:40',
        Rule::unique('accounts')->where(fn($query) => $query->where('user_id', $userId)),
      ],
    ]);

    $account = Account::create([
      'name' => $request->input('name'),
      'user_id' => $userId,
    ]);

    return response()->json([
      'message' => 'Account created successfully',
      'account' => AccountResource::make($account),
    ], 201);
  }

  public function show(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $account = Account::where('id', $id)
      ->where('user_id', $userId)
      ->firstOrFail();

    $income = (float) $account->transactions()
      ->whereHas('type', fn($q) => $q->where('name', 'income'))
      ->sum('amount');

    $expense = (float) $account->transactions()
      ->whereHas('type', fn($q) => $q->where('name', 'expense'))
      ->sum('amount');

    return response()->json([
      'id' => $account->id,
      'name' => $account->name,
      'income_sum' => round($income, 2),
      'expense_sum' => round($expense, 2),
      'balance' => round($income - $expense, 2),
    ]);
  }

  public function update(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $account = Account::where('id', $id)
      ->where('user_id', $userId)
      ->firstOrFail();

    $request->validate([
      'name' => [
        'required',
        'string',
        'max:40',
        Rule::unique('accounts')->where(fn($query) => $query->where('user_id', $userId))->ignore($account->id),
      ],
    ]);

    $account->update([
      'name' => $request->input('name'),
    ]);

    return response()->json([
      'message' => 'Account updated successfully',
      'account' => AccountResource::make($account),
    ]);
  }

  public function destroy(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $account = Account::where('id', $id)
      ->where('user_id', $userId)
      ->first();

    if (!$account) {
      return response()->json([
        'message' => 'Account not found',
      ], 404);
    }

    $affectedTransactions = $account->transactions()->count();
    $account->delete();

    return response()->json([
      'message' => 'Account deleted successfully',
      'affected_transactions' => $affectedTransactions,
    ]);
  }
}
