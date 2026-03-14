<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TransactionCollection extends ResourceCollection
{
  /**
   * Transform the resource collection into an array.
   *
   * @return array<int|string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      "message" => "Transactions retrieved successfully",
      "transactions" => $this->collection,
    ];
  }

  public function paginationInformation($request, $paginated, $default)
  {
    unset($default['links']);
    
    unset($default['meta']['from']);
    unset($default['meta']['to']);
    unset($default['meta']['path']);
    unset($default['meta']['links']);

    return $default;
  }
}
