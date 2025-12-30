<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\TicketStoreRequest;
use App\Services\TicketService;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TicketResource;
use Illuminate\Support\Facades\Auth;

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
        if (Auth::user()->isCustomer()) {
            $params['created_by'] = Auth::user()->id;
        }

        $tickets = $this->ticketService->getAllTickets($params);


        return response()->json([
            "success" => true,
            "message" => "success",
            "data" => $tickets,
        ], Response::HTTP_OK);
    }

    public function show($id)
    {
        try {
            $ticket = $this->ticketService->getTicketById($id);

            if (!$ticket) {
                return response()->json([
                    "success" => false,
                    "message" => "ticket not found",
                    "data" => null,
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "message" => "success",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "failed getting ticket",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
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
                "success" => true,
                "message" => "success creating ticket",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => "failed creating ticket",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->validated();

        DB::beginTransaction();

        try {
            $ticket = Ticket::findOrFail($id);
            $ticket->title = $data['title'];
            $ticket->description = $data['description'];
            $ticket->priority = $data['priority'];
            $ticket->status = $data['status'];
            $ticket->save();

            DB::commit();

            return response()->json([
                'success' => true,
                "message" => "success updating ticket",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => "failed updating ticket",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
