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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('lease_id')->constrained('leases')->onDelete('cascade');
            $table->decimal('amount',10,2);
            $table->decimal('late_fee',10,2);
            $table->date('due_date');
            $table->timestamp('paid_at')->nullable();
            $table->enum('status',['PENDING','PAID','PARTIAL','LATE']);
            $table->enum('type', ['RENT', 'EXTRA_CHARGE', 'DEPOSIT', 'UTILITY'])->default('RENT');
            $table->json('breakdown')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
