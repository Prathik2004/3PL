<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('shipment_id')->unique();
            $table->string('client_name');
            $table->string('origin');
            $table->string('destination');
            $table->timestamp('dispatch_date');
            $table->timestamp('expected_delivery_date');
            $table->timestamp('delivered_date')->nullable();
            $table->enum('status', [
                'Created',
                'Dispatched',
                'In Transit',
                'Out for Delivery',
                'Delivered',
                'Delayed',
                'Cancelled',
            ])->default('Created');
            $table->string('carrier_name');
            $table->boolean('pod_received')->default(false);
            $table->timestamp('last_status_update')->nullable();
            $table->uuid('created_by')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('client_name');
            $table->index('status');
            $table->index('carrier_name');
            $table->index('expected_delivery_date');
            $table->index('last_status_update');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};