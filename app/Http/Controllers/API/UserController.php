<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page') ?? getDefaultPaginationNumber();
        
        $filters = $request->only('search', 'sort_by', 'sort_order');

        $users = User::filter($filters)
            ->paginate($perPage)
            ->withQueryString();

        return response()->json(new UserCollection($users), Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $input = $request->validated();

        $user = User::create($input);

        return response()->json(new UserResource($user), Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $input = $request->validated();

        $user->update($input);

        return response()->json(new UserResource($user), Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['success' => true], Response::HTTP_OK);
    }

    public function getAuthUser(Request $request)
    {
        return response()->json($request->user(), Response::HTTP_OK);
    }
}
