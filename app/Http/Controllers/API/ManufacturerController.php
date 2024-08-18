<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreManufacturereRequest;
use App\Http\Requests\UpdateManufacturerRequest;
use App\Http\Resources\ManufacturerCollection;
use App\Http\Resources\ManufacturerResource;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ManufacturerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('read manufacturers');

        $perPage = $request->get('per_page') ?? getDefaultPaginationNumber();
        
        $filters = $request->only('search', 'sort_by', 'sort_order');

        $manufacturers = Manufacturer::filter($filters)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(new ManufacturerCollection($manufacturers), Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreManufacturereRequest $request)
    {
        $this->authorize('create manufacturers');

        $input = $request->validated();

        $manufacturer = Manufacturer::create($input);

        return response()->json(new ManufacturerResource($manufacturer), Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     */
    public function show(Manufacturer $manufacturer)
    {
        $this->authorize('create manufacturers');

        return response()->json(new ManufacturerResource($manufacturer), Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateManufacturerRequest $request, Manufacturer $manufacturer)
    {
        $this->authorize('update manufacturers');

        $input = $request->validated();

        $manufacturer->update($input);

        return response()->json(new ManufacturerResource($manufacturer), Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Manufacturer $manufacturer)
    {
        $this->authorize('delete manufacturers');

        $manufacturer->delete();

        return response()->json(['success' => true], Response::HTTP_OK);
    }
}
