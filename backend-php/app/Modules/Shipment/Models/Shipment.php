<?php

namespace App\Modules\Shipment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Shipment extends Model
{
    use SoftDeletes;

    public $incrementing = false;
    protected $keyType   = 'string';
    protected $table     = 'shipments';

    protected $fillable = [
        'id',
        'shipment_id',
        'client_name',
        'origin',
        'destination',
        'dispatch_date',
        'expected_delivery_date',
        'delivered_date',
        'status',
        'carrier_name',
        'pod_received',
        'last_status_update',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'pod_received'           => 'boolean',
            'dispatch_date'          => 'datetime',
            'expected_delivery_date' => 'datetime',
            'delivered_date'         => 'datetime',
            'last_status_update'     => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}