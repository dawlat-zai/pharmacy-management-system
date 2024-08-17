<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\SupplierCollection;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('read suppliers');

        $perPage = $request->get('per_page') ?? getDefaultPaginationNumber();
        
        $filters = $request->only('search', 'sort_by', 'sort_order');

        $suppliers = Supplier::filter($filters)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(new SupplierCollection($suppliers), Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        $this->authorize('create suppliers');

        $input = $request->validated();

        $supplier = Supplier::create($input);

        return response()->json(new SupplierResource($supplier), Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        $this->authorize('read suppliers');

        return response()->json(new SupplierResource($supplier), Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $this->authorize('update suppliers');

        $input = $request->validated();

        $supplier->update($input);

        return response()->json(new SupplierResource($supplier), Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $this->authorize('delete suppliers');

        $supplier->delete();

        return response()->json(['success' => true], Response::HTTP_OK);
    }
}
