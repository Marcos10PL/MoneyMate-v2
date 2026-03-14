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
    Schema::create('transactions', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->decimal('amount', 10, 2);
      $table->date('date')->default(now());
      $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->foreignId('type_id')->references('id')->on('types');
      $table->foreignId('category_id')->references('id')->on('categories');
      // $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('transactions');
  }
};
