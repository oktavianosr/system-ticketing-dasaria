<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use Illuminate\Http\Request;
use App\Http\Requests\TicketStoreRequest;
use App\Services\TicketService;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TicketResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CommentStoreRequest;

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
        if (Auth::user()->isCustomer()) {
            $tickets = $tickets->where('created_by', Auth::user()->id);
        }



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

            if (Auth::user()->isCustomer() && $ticket->created_by != auth()->user()->id) {
                return response()->json([
                    "success" => false,
                    "message" => "You are not authorized to view this ticket",
                    "data" => null,
                ], Response::HTTP_FORBIDDEN);
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

    public function storeComment(CommentStoreRequest $request, $id)
    {
        $data = $request->validated();

        try {
            $comment = $this->ticketService->addComment($id, $data);

            return response()->json([
                'success' => true,
                "message" => "success creating comment",
                "data" => new CommentResource($comment),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            $status = $e->getCode() == 403 ? Response::HTTP_FORBIDDEN : Response::HTTP_INTERNAL_SERVER_ERROR;
            return response()->json([
                "success" => false,
                "message" => "failed creating comment",
                "data" => $e->getMessage(),
            ], $status);
        }
    }

    public function getComments($id)
    {

        try {
            $comment = $this->ticketService->getComment($id);

            return response()->json([
                'success' => true,
                "message" => "success getting comment",
                "data" => $comment,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "failed getting comment",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
