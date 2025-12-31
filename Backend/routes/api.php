<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\UserController;


Route::post("auth/login", [AuthenticationController::class, "login"]);

Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post("auth/logout", [AuthenticationController::class, "logout"]);
    Route::get("auth/me", [AuthenticationController::class, "me"]);

    // Ticket
    Route::get("tickets", [TicketController::class, "show"]);
    Route::post("tickets", [TicketController::class, "store"]);
    Route::get("tickets/{id}", [TicketController::class, "showById"]);
    Route::put("tickets/{id}", [TicketController::class, "update"]);

    // Assign
    Route::put("tickets/{id}/assign", [TicketController::class, "assign"]);

    // Comment
    Route::post("tickets/{id}/comments", [TicketController::class, "storeComment"]);
    Route::get("tickets/{id}/comments", [TicketController::class, "getComments"]);

    // Users
    Route::get("users/agents", [UserController::class, "getAgents"]);
    Route::put("user/profile", [UserController::class, "updateProfile"]);
    Route::put("user/password", [UserController::class, "changePassword"]);
});
