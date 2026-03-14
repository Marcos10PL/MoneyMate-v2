<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
  public $timestamps = false;
  protected $fillable = [
    'name',
    'amount',
    'category_id',
    'type_id',
    'user_id',
    'account_id',
    'date',
  ];

  public function category()
  {
    return $this->belongsTo(Category::class);
  }

  public function type()
  {
    return $this->belongsTo(Type::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function account()
  {
    return $this->belongsTo(Account::class);
  }
}
