<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AuthenticationController;


Route::post("login", [AuthenticationController::class, "login"]);

Route::middleware('auth:sanctum')->group(function () {
    Route::post("logout", [AuthenticationController::class, "logout"]);
    Route::get("me", [AuthenticationController::class, "me"]);


    Route::get("tickets", [TicketController::class, "index"]);
    Route::post("/store/ticket", [TicketController::class, "store"]);
});
