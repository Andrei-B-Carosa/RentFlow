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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('payment_id')->constrained('payments')->onDelete('cascade');
            $table->foreignUuid('recorded_by')->constrained('users');
            $table->string('status');
            $table->string('type');
            $table->decimal('late_fee',10,2)->nullable();
            $table->decimal('amount_paid',10,2);
            $table->string('landlord_notes')->nullable();
            $table->date('paid_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
