<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exceptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('shipment_id');
            $table->enum('exception_type', [
                'Delay',
                'NoUpdate',
                'MissingPOD',
                'NotDispatched',
            ]);
            $table->string('status');
            $table->text('reason');
            $table->boolean('resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->uuid('resolved_by')->nullable();
            $table->text('resolution_note')->nullable();
            $table->timestamps();

            $table->index('shipment_id');
            $table->index('resolved');
            $table->index('exception_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exceptions');
    }
};