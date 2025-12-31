<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssignTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
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

    public function show(Request $request)
    {
        try {
            $params = $request->all();
            $tickets = $this->ticketService->getAllTickets($params);
            if (Auth::user()->isCustomer()) {
                $tickets = $tickets->where('created_by', Auth::user()->id);
                return response()->json([
                    "success" => true,
                    "message" => "successful getting all tickets",
                    "data" => $tickets,
                ], Response::HTTP_OK);
            }



            return response()->json([
                "success" => true,
                "message" => "successful getting all tickets",
                "data" => $tickets,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "failed getting all tickets",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function showById($id)
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
                "message" => "success getting ticket",
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

        try {
            $ticket = $this->ticketService->createTicket($data);

            return response()->json([
                "success" => true,
                "message" => "success creating ticket",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            $status = $e->getCode() == 403 ? Response::HTTP_FORBIDDEN : Response::HTTP_INTERNAL_SERVER_ERROR;
            return response()->json([
                "success" => false,
                "message" => "failed creating ticket",
                "data" => $e->getMessage(),
            ], $status);
        }
    }

    public function update(UpdateTicketRequest $request, $id)
    {
        $data = $request->validated();

        $ticket = $this->ticketService->getTicketById($id);
        $user = auth()->user();

        if ($user->isCustomer()) {
            return response()->json([
                "success" => false,
                "message" => "You are not authorized to update this ticket",
                "data" => null,
            ], Response::HTTP_FORBIDDEN);
        }

        if ($user->isAgent()) {
            if ($ticket->assigned_to != $user->id) {
                return response()->json([
                    "success" => false,
                    "message" => "You can only update tickets assigned to you",
                    "data" => null,
                ], Response::HTTP_FORBIDDEN);
            }

            $allowedFields = ['status'];
            $forbiddenFields = array_diff(array_keys($data), $allowedFields);

            if (!empty($forbiddenFields)) {
                return response()->json([
                    "success" => false,
                    "message" => "Agents can only update the ticket status",
                    "data" => null,
                ], Response::HTTP_FORBIDDEN);
            }

            if (isset($data['status']) && !in_array($data['status'], ['resolved', 'closed'])) {
                return response()->json([
                    "success" => false,
                    "message" => "Agents can only set status to 'resolved' or 'closed'",
                    "data" => null,
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        try {
            $ticket = $this->ticketService->updateTicket($ticket, $data);

            return response()->json([
                "success" => true,
                "message" => "success updating ticket",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            $status = $e->getCode() == 403 ? Response::HTTP_FORBIDDEN : Response::HTTP_INTERNAL_SERVER_ERROR;
            return response()->json([
                "success" => false,
                "message" => "failed updating ticket",
                "data" => $e->getMessage(),
            ], $status);
        }
    }

    public function storeComment(CommentStoreRequest $request, $id)
    {
        $data = $request->validated();
        $user = auth()->user();
        $ticket = $this->ticketService->getTicketById($id);

        if (!$user->isAdmin() && ($ticket->created_by != $user->id && $ticket->assigned_to != $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to comment on this ticket',
            ], Response::HTTP_FORBIDDEN);
        }

        try {
            $comment = $this->ticketService->addComment($id, $data);

            return response()->json([
                "success" => true,
                "message" => "success creating comment",
                "data" => new CommentResource($comment),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "failed creating comment",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getComments($id)
    {

        try {
            $comment = $this->ticketService->getComment($id);

            if (auth()->user()->isAdmin()) {
                return response()->json([
                    "success" => true,
                    "message" => "success getting comment",
                    "data" => new TicketResource($comment),
                ], Response::HTTP_OK);
            }

            if ($comment->created_by != auth()->user()->id) {
                return response()->json([
                    "success" => false,
                    "message" => "You are not authorized to view this comment",
                    "data" => null,
                ], Response::HTTP_FORBIDDEN);
            }

            return response()->json([
                "success" => true,
                "message" => "success getting comment",
                "data" => new TicketResource($comment),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "failed getting comment",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function assign(AssignTicketRequest $request, $id)
    {
        $ticket = $this->ticketService->getTicketById($id);
        $user = auth()->user();

        if (!$user->isAdmin() && !$user->isAgent()) {
            return response()->json([
                "success" => false,
                "message" => "You are not authorized to assign ticket",
                "data" => null,
            ], Response::HTTP_FORBIDDEN);
        }

        $data = $request->validated();

        try {
            $ticket = $this->ticketService->assignAgent($ticket, $data);

            return response()->json([
                "success" => true,
                "message" => "success assigning ticket",
                "data" => new TicketResource($ticket),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "failed assigning ticket",
                "data" => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }


    }
}
