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
    Route::get("tickets", [TicketController::class, "index"]);
    Route::post("ticket/store", [TicketController::class, "store"]);
    Route::get("tickets/{id}", [TicketController::class, "show"]);
    Route::put("tickets/{id}", [TicketController::class, "update"]);

});
