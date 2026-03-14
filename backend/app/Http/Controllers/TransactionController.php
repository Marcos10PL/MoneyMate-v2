<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionCollection;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class TransactionController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $user = $request->user();

    $transactionsQuery = $user->transactions()->with(['category', 'type', 'account']);

    if ($request->has('category_id')) {
      $transactionsQuery->where('category_id', $request->input('category_id'));
    }

    if ($request->has('start_date') && $request->has('end_date')) {
      $startDate = Carbon::parse($request->input('start_date'))->timezone('Europe/Warsaw')->startOfDay();
      $endDate = Carbon::parse($request->input('end_date'))->timezone('Europe/Warsaw')->endOfDay();

      $transactionsQuery->whereBetween('date', [$startDate, $endDate]);
    } elseif ($request->has('start_date')) {
      $startDate = Carbon::parse($request->input('start_date'))->startOfDay();

      $transactionsQuery->where('date', '>=', $startDate);
    } elseif ($request->has('end_date')) {
      $endDate = Carbon::parse($request->input('end_date'))->timezone('Europe/Warsaw')->endOfDay();

      $transactionsQuery->where('date', '<=', $endDate);
    }

    if ($request->has('sort_by') && in_array($request->input('sort_by'), ['asc', 'desc'])) {
      $transactionsQuery->orderBy('amount', $request->input('sort_by'));
    } else if ($request->has('sort_by') && $request->input('sort_by') == 'asc') {
      $transactionsQuery->orderBy('amount', 'asc');
    }

    if ($request->has('search') && $request->input('search') != '') {
      $transactionsQuery->where('name', 'like', '%' . $request->input('search') . '%');
    }

    if ($request->has('type_id')) {
      $transactionsQuery->where('type_id', $request->input('type_id'));
    }

    $income = (float) $user->transactions()
      ->whereHas('type', fn($q) => $q
        ->where('name', 'income'))
      ->sum('amount');

    $expense = (float) $user->transactions()
      ->whereHas('type', fn($q) => $q
        ->where('name', 'expense'))
      ->sum('amount');

    $transactions = $transactionsQuery->paginate($request->input('per_page', 10));

    return response()->json([
      'data' => [
        'transactions' => TransactionResource::collection($transactions),
        'income_sum' => round($income, 2),
        'expense_sum' => round($expense, 2),
        'balance' => round($income - $expense, 2)
      ],
      'meta' => [
        'current_page' => $transactions->currentPage(),
        'per_page' => $transactions->perPage(),
        'last_page' => $transactions->lastPage(),
        'total' => $transactions->total()
      ]
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $userId = $request->user()->id;

    $request->validate([
      'name' => ['required', 'string', 'max:40', 'regex:/^[\pL0-9.,\- ]+$/u'],
      'amount' => 'required|numeric',
      'type_id' => 'required|exists:types,id',
      'category_id' => [
        'required',
        Rule::exists('categories', 'id')->where(function ($query) use ($userId) {
          $query->where(function ($q) use ($userId) {
            $q->whereNull('user_id')
              ->orWhere('user_id', $userId);
          });
        }),
      ],
      'account_id' => [
        'nullable',
        Rule::exists('accounts', 'id')->where('user_id', $userId),
      ],
      'date' => 'nullable|date',
    ]);

    $transaction = Transaction::create([
      'name' => $request->input('name'),
      'amount' => $request->input('amount'),
      'type_id' => $request->input('type_id'),
      'category_id' => $request->input('category_id'),
      'account_id' => $request->input('account_id'),
      'user_id' => $userId,
      'date' => $request->input('date')
        ? Carbon::parse($request
          ->input('date'))
          ->timezone('Europe/Warsaw')
        : Carbon::now('Europe/Warsaw'),
    ]);

    return response()->json([
      'message' => 'Transaction created successfully',
      'transaction' => TransactionResource::make($transaction),
    ], 201);
  }

  /**
   * Display the specified resource.
   */
  public function show(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $transaction = Transaction::where('id', $id)
      ->where('user_id', $userId)
      ->firstOrFail();

    return TransactionResource::make($transaction);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $request->validate([
      'name' => ['required', 'string', 'max:40', 'regex:/^[\pL0-9.,\- ]+$/u'],
      'amount' => 'required|numeric',
      'type_id' => 'required|exists:types,id',
      'category_id' => [
        'required',
        Rule::exists('categories', 'id')->where(function ($query) use ($userId) {
          $query->where(function ($q) use ($userId) {
            $q->whereNull('user_id')
              ->orWhere('user_id', $userId);
          });
        }),
      ],
      'account_id' => [
        'nullable',
        Rule::exists('accounts', 'id')->where('user_id', $userId),
      ],
      'date' => 'nullable|date',
    ]);

    $transaction = Transaction::where('id', $id)
      ->where('user_id', $userId)
      ->firstOrFail();

    $transaction->update([
      'name' => $request->input('name'),
      'amount' => $request->input('amount'),
      'type_id' => $request->input('type_id'),
      'category_id' => $request->input('category_id'),
      'account_id' => $request->input('account_id'),
      'date' => $request->input('date')
        ? Carbon::parse($request
          ->input('date'))
          ->timezone('Europe/Warsaw')
        : Carbon::now('Europe/Warsaw'),
    ]);

    return response()->json([
      'message' => 'Transaction updated successfully',
      'transaction' => TransactionResource::make($transaction),
    ], 200);

  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $transaction = Transaction::where('id', $id)
      ->where('user_id', $userId)
      ->first();

    if (!$transaction) {
      return response()->json([
        'message' => 'Transaction not found',
      ], 404);
    }

    $transaction->delete();

    return response()->json([
      'message' => 'Transaction deleted successfully',
    ], 200);
  }
}
