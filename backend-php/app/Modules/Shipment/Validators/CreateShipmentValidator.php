<?php

namespace App\Modules\Shipment\Validators;

use Illuminate\Support\Facades\Validator;
use App\Constants\ShipmentStatus;

class CreateShipmentValidator
{
    public static function validate(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make($data, [
            'shipment_id'            => 'required|string|unique:shipments,shipment_id',
            'client_name'            => 'required|string|max:255',
            'origin'                 => 'required|string|max:255',
            'destination'            => 'required|string|max:255',
            'dispatch_date'          => 'required|date',
            'expected_delivery_date' => 'required|date|after:dispatch_date',
            'carrier_name'           => 'required|string|max:255',
            'pod_received'           => 'sometimes|boolean',
        ]);
    }
}