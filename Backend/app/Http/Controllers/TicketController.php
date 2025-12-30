<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Requests\TicketStoreRequest;
use App\Services\TicketService;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TicketResource;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index(Request $request)
    {
        $params = $request->all();
        $tickets = $this->ticketService->getAllTickets($params);

        return response()->json([
            "message" => "success",
            "data" => $tickets,
        ], Response::HTTP_OK);
    }

    public function store(TicketStoreRequest $request)
    {
        $data = $request->validated();

        DB::beginTransaction();

        try {
            $ticket = new Ticket;
            $ticket->created_by = auth()->user()->id;
            $ticket->code = "TIC-" . rand(1000, 9999);
            $ticket->title = $data['title'];
            $ticket->description = $data['description'];
            $ticket->priority = $data['priority'];
            $ticket->status = $data['status'];
            $ticket->save();

            DB::commit();

            return response()->json([
                "message" => "success creating ticket",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "message" => "failed creating ticket",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
