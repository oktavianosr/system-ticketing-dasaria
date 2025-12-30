<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AuthenticationController;


Route::post("login", [AuthenticationController::class, "login"]);

Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post("logout", [AuthenticationController::class, "logout"]);
    Route::get("me", [AuthenticationController::class, "me"]);

    // Ticket
    Route::post("tickets", [TicketController::class, "store"]);
    Route::get("tickets", [TicketController::class, "index"]);
    Route::get("tickets/{id}", [TicketController::class, "show"]);
    Route::put("tickets/{id}", [TicketController::class, "update"]);

    // Comment
    Route::post("tickets/{id}/comments", [TicketController::class, "storeComment"]);
    Route::get("tickets/{id}/comments", [TicketController::class, "getComments"]);
});
