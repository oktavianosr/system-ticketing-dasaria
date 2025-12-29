<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Repositories\TicketRepository;
use Symfony\Component\HttpFoundation\Response;

class TicketController extends Controller
{
    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    public function index(Request $request)
    {
        $params = $request->all();
        $ticket = $this->ticketRepository->getAllTickets($params);

        return response()->json([
            "message" => "success",
            "data" => $ticket,
        ], Response::HTTP_OK);
    }
}
