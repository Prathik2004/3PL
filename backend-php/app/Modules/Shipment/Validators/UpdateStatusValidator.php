<?php

namespace App\Modules\Shipment\Validators;

use Illuminate\Support\Facades\Validator;
use App\Constants\ShipmentStatus;

class UpdateStatusValidator
{
    public static function validate(array $data, string $dispatchDate): \Illuminate\Validation\Validator
    {
        return Validator::make($data, [
            'status'         => 'required|in:' . implode(',', ShipmentStatus::ALL),
            'delivered_date' => [
                'required_if:status,Delivered',
                'nullable',
                'date',
                'after:' . $dispatchDate,
            ],
            'pod_received'   => 'sometimes|boolean',
        ], [
            'delivered_date.after' => 'Delivered date must be after the dispatch date.',
        ]);
    }
}