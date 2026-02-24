<?php

namespace App\Modules\Exception\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ShipmentException extends Model
{
    public $incrementing = false;
    protected $keyType   = 'string';
    protected $table     = 'exceptions';

    protected $fillable = [
        'id',
        'shipment_id',
        'exception_type',
        'status',
        'reason',
        'resolved',
        'resolved_at',
        'resolved_by',
        'resolution_note',
    ];

    protected function casts(): array
    {
        return [
            'resolved'    => 'boolean',
            'resolved_at' => 'datetime',
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