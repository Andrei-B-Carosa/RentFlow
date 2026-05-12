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
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignUuid('tenant_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('description');
            $table->json('photos')->nullable();
            $table->enum('priority',['LOW','MEDIUM','HIGH','URGENT']);
            $table->enum('status',['OPEN','IN_PROGRESS','RESOLVED']);
            $table->text('landlord_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_requests');
    }
};
