<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoFinanceSeeder extends Seeder
{
  /**
   * Seed demo user with accounts, categories and transactions.
   */
  public function run(): void
  {
    $userRole = Role::firstOrCreate(['name' => 'user']);

    $user = User::updateOrCreate(
      ['email' => 'demo@moneymate.local'],
      [
        'name' => 'Demo User',
        'password' => Hash::make('Demo123.'),
        'role_id' => $userRole->id,
      ]
    );

    $incomeType = Type::firstOrCreate(['name' => 'income']);
    $expenseType = Type::firstOrCreate(['name' => 'expense']);

    $customCategoryNames = [
      'Freelance',
      'Investments',
      'Subscriptions',
      'Pets',
      'Hobby',
      'Car Repairs',
    ];

    $categories = [];
    foreach ($customCategoryNames as $name) {
      $category = Category::firstOrCreate(
        ['name' => $name, 'user_id' => $user->id],
        ['name' => $name]
      );

      $categories[$name] = $category;
    }

    $accountNames = [
      'Main Account',
      'Savings Account',
      'Credit Card',
      'Business Account',
      'Travel Account',
    ];

    $accounts = [];
    foreach ($accountNames as $name) {
      $account = Account::firstOrCreate([
        'name' => $name,
        'user_id' => $user->id,
      ]);

      $accounts[$name] = $account;
    }

    Transaction::where('user_id', $user->id)->delete();

    $transactions = [
      [
        'name' => 'Monthly salary',
        'amount' => 8200.00,
        'date' => now()->subDays(28)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Freelance']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Grocery shopping',
        'amount' => 420.50,
        'date' => now()->subDays(27)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Transfer to savings',
        'amount' => 1800.00,
        'date' => now()->subDays(25)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Investments']->id,
        'account_id' => $accounts['Savings Account']->id,
      ],
      [
        'name' => 'Monthly interest',
        'amount' => 47.80,
        'date' => now()->subDays(24)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Investments']->id,
        'account_id' => $accounts['Savings Account']->id,
      ],
      [
        'name' => 'Fuel',
        'amount' => 320.00,
        'date' => now()->subDays(21)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Car Repairs']->id,
        'account_id' => $accounts['Credit Card']->id,
      ],
      [
        'name' => 'Car service',
        'amount' => 890.00,
        'date' => now()->subDays(20)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Car Repairs']->id,
        'account_id' => $accounts['Credit Card']->id,
      ],
      [
        'name' => 'Invoice client A',
        'amount' => 3500.00,
        'date' => now()->subDays(18)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Freelance']->id,
        'account_id' => $accounts['Business Account']->id,
      ],
      [
        'name' => 'Adobe & tools',
        'amount' => 270.00,
        'date' => now()->subDays(17)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Subscriptions']->id,
        'account_id' => $accounts['Business Account']->id,
      ],
      [
        'name' => 'Travel budget',
        'amount' => 1200.00,
        'date' => now()->subDays(14)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Travel Account']->id,
      ],
      [
        'name' => 'Accommodation & tickets',
        'amount' => 940.00,
        'date' => now()->subDays(10)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Travel Account']->id,
      ],
      [
        'name' => 'Vet visit',
        'amount' => 210.00,
        'date' => now()->subDays(8)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Pets']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Sold old equipment',
        'amount' => 600.00,
        'date' => now()->subDays(6)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Netflix subscription',
        'amount' => 45.00,
        'date' => now()->subDays(5)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Subscriptions']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Dog food',
        'amount' => 130.00,
        'date' => now()->subDays(5)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Pets']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Bonus payment',
        'amount' => 1500.00,
        'date' => now()->subDays(4)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Freelance']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Gym membership',
        'amount' => 99.00,
        'date' => now()->subDays(4)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Electricity bill',
        'amount' => 280.00,
        'date' => now()->subDays(3)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Subscriptions']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Dividend income',
        'amount' => 340.00,
        'date' => now()->subDays(3)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Investments']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Restaurant dinner',
        'amount' => 185.00,
        'date' => now()->subDays(2)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Online course',
        'amount' => 249.00,
        'date' => now()->subDays(2)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Refund from shop',
        'amount' => 75.00,
        'date' => now()->subDays(1)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
      [
        'name' => 'Phone bill',
        'amount' => 60.00,
        'date' => now()->subDays(1)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Subscriptions']->id,
        'account_id' => $accounts['Main Account']->id,
      ],
    ];

    foreach ($transactions as $transaction) {
      Transaction::create([
        ...$transaction,
        'user_id' => $user->id,
      ]);
    }
  }
}
