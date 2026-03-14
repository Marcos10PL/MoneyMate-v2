<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('categories', function (Blueprint $table) {
      $table->id();
      $table->string('name');
    });

    DB::table('categories')->insert([
      ['name' => 'Food'],
      ['name' => 'Transport'],
      ['name' => 'Entertainment'],
      ['name' => 'Health'],
      ['name' => 'Education'],
      ['name' => 'Housing'],
      ['name' => 'Utilities'],
      ['name' => 'Clothing'],
      ['name' => 'Travel'],
      ['name' => 'Other'],
    ]);
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('categories');
  }
};
