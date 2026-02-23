<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipment_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('shipment_id');
            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->uuid('changed_by')->nullable();
            $table->timestamps();

            $table->index('shipment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipment_logs');
    }
};