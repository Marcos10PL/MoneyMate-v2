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
      'Inwestycje',
      'Subskrypcje',
      'Zwierzaki',
      'Hobby',
      'Naprawy auta',
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
      'Konto Glowne',
      'Konto Oszczednosciowe',
      'Karta Kredytowa',
      'Konto Firmowe',
      'Konto Podroze',
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
        'name' => 'Wyplata etat',
        'amount' => 8200.00,
        'date' => now()->subDays(28)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Freelance']->id,
        'account_id' => $accounts['Konto Glowne']->id,
      ],
      [
        'name' => 'Zakupy spozywcze',
        'amount' => 420.50,
        'date' => now()->subDays(27)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Konto Glowne']->id,
      ],
      [
        'name' => 'Przelew na oszczednosci',
        'amount' => 1800.00,
        'date' => now()->subDays(25)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Inwestycje']->id,
        'account_id' => $accounts['Konto Oszczednosciowe']->id,
      ],
      [
        'name' => 'Odsetki miesieczne',
        'amount' => 47.80,
        'date' => now()->subDays(24)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Inwestycje']->id,
        'account_id' => $accounts['Konto Oszczednosciowe']->id,
      ],
      [
        'name' => 'Paliwo',
        'amount' => 320.00,
        'date' => now()->subDays(21)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Naprawy auta']->id,
        'account_id' => $accounts['Karta Kredytowa']->id,
      ],
      [
        'name' => 'Serwis auta',
        'amount' => 890.00,
        'date' => now()->subDays(20)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Naprawy auta']->id,
        'account_id' => $accounts['Karta Kredytowa']->id,
      ],
      [
        'name' => 'Faktura klient A',
        'amount' => 3500.00,
        'date' => now()->subDays(18)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Freelance']->id,
        'account_id' => $accounts['Konto Firmowe']->id,
      ],
      [
        'name' => 'Adobe i narzedzia',
        'amount' => 270.00,
        'date' => now()->subDays(17)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Subskrypcje']->id,
        'account_id' => $accounts['Konto Firmowe']->id,
      ],
      [
        'name' => 'Budzet wyjazdowy',
        'amount' => 1200.00,
        'date' => now()->subDays(14)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Konto Podroze']->id,
      ],
      [
        'name' => 'Noclegi i bilety',
        'amount' => 940.00,
        'date' => now()->subDays(10)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Konto Podroze']->id,
      ],
      [
        'name' => 'Weterynarz',
        'amount' => 210.00,
        'date' => now()->subDays(8)->toDateString(),
        'type_id' => $expenseType->id,
        'category_id' => $categories['Zwierzaki']->id,
        'account_id' => $accounts['Konto Glowne']->id,
      ],
      [
        'name' => 'Sprzedaz starego sprzetu',
        'amount' => 600.00,
        'date' => now()->subDays(6)->toDateString(),
        'type_id' => $incomeType->id,
        'category_id' => $categories['Hobby']->id,
        'account_id' => $accounts['Konto Glowne']->id,
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
