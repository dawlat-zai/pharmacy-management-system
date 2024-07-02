<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('read categories');
        
        $perPage = $request->get('per_page') ?? getDefaultPaginationNumber();
        
        $filters = $request->only('search', 'sort_by', 'sort_order');

        $categories = Category::filter($filters)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(new CategoryCollection($categories), Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('create categories');

        $input = $request->validated();

        $category = Category::create($input);

        return response()->json(new CategoryResource($category), Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $this->authorize('read categories');

        return response()->json(new CategoryResource($category), Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update categories');

        $input = $request->validated();

        $category->update($input);

        return response()->json(new CategoryResource($category), Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete categories');

        $category->delete();

        return response()->json(['success' => true], Response::HTTP_OK);
    }
}
