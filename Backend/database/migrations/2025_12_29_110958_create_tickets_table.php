<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->text('description');
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->foreignId('created_by')->references('id')->on('users')->cascadeOnDelete();
            $table->foreignId('assigned_to')->nullable();
            $table->integer('assigned_by')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->integer('updated_by')->references('id')->on('users')->cascadeOnDelete()->nullable();
            $table->timestamps();
            $table->timestamp('completed_at')->nullable();
            $table->softDeletes()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
