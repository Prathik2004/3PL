<?php

namespace App\Modules\CsvUpload\Validators;

use Illuminate\Support\Facades\Validator;

class CsvUploadValidator
{
    public static function validateFile(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make($data, [
            'file' => 'required|file|mimes:csv,txt|max:5120',
        ]);
    }

    public static function validateRow(array $row): \Illuminate\Validation\Validator
    {
        return Validator::make($row, [
            'shipment_id'            => 'required|string',
            'client_name'            => 'required|string',
            'origin'                 => 'required|string',
            'destination'            => 'required|string',
            'dispatch_date'          => 'required|date',
            'expected_delivery_date' => 'required|date|after:dispatch_date',
            'carrier_name'           => 'required|string',
            'pod_received'           => 'nullable|in:true,false,1,0',
        ]);
    }
}