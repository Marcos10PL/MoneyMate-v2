<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
  /**
   * Display a listing of the resource.
   * Returns global categories (user_id = null) + user's own categories.
   */
  public function index(Request $request)
  {
    $userId = $request->user()->id;

    $categories = Category::where(function ($query) use ($userId) {
      $query->whereNull('user_id')
        ->orWhere('user_id', $userId);
    })->get();

    return response()->json([
      'message' => 'Categories retrieved successfully',
      'categories' => $categories->map(fn($c) => CategoryResource::make($c)),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   * Creates a category owned by the authenticated user.
   */
  public function store(Request $request)
  {
    $user = $request->user();
    $userId = $user->id;
    $isAdmin = $user->isAdmin();
    $isGlobal = $isAdmin && $request->boolean('is_global');
    $ownerUserId = $isGlobal ? null : $userId;

    $request->validate([
      'name' => [
        'required',
        'string',
        'max:40',
        $isGlobal
        ? Rule::unique('categories')->whereNull('user_id')
        : Rule::unique('categories')->where(fn($query) => $query->where('user_id', $userId)),
      ],
    ]);

    $category = Category::create([
      'name' => $request->input('name'),
      'user_id' => $ownerUserId,
    ]);

    return response()->json([
      'message' => 'Category created successfully',
      'category' => CategoryResource::make($category),
    ], 201);
  }

  /**
   * Update the specified resource in storage.
   * Only the owner can update their own category.
   */
  public function update(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $category = Category::where('id', $id)
      ->where('user_id', $userId)
      ->first();

    if (!$category) {
      return response()->json([
        'message' => 'Category not found or you do not have permission to update it',
      ], 404);
    }

    $request->validate([
      'name' => [
        'required',
        'string',
        'max:40',
        Rule::unique('categories')->where(fn($query) => $query->where('user_id', $userId))->ignore($category->id),
      ],
    ]);

    $category->update([
      'name' => $request->input('name'),
    ]);

    return response()->json([
      'message' => 'Category updated successfully',
      'category' => CategoryResource::make($category),
    ]);
  }

  /**
   * Remove the specified resource from storage.
   * Only the owner can delete their own category.
   * Cannot delete if any transactions are assigned to it.
   */
  public function destroy(Request $request, string $id)
  {
    $userId = $request->user()->id;

    $category = Category::where('id', $id)
      ->where('user_id', $userId)
      ->first();

    if (!$category) {
      return response()->json([
        'message' => 'Category not found or you do not have permission to delete it',
      ], 404);
    }

    if ($category->transactions()->exists()) {
      return response()->json([
        'message' => 'Cannot delete category that is assigned to transactions',
      ], 422);
    }

    $category->delete();

    return response()->json([
      'message' => 'Category deleted successfully',
    ]);
  }
}
