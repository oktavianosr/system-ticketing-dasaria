<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\TicketController;

Route::get("/tickets", [TicketController::class, "index"]);