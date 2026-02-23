<?php

namespace App\Constants;

class ShipmentStatus
{
    const CREATED          = 'Created';
    const DISPATCHED       = 'Dispatched';
    const IN_TRANSIT       = 'In Transit';
    const OUT_FOR_DELIVERY = 'Out for Delivery';
    const DELIVERED        = 'Delivered';
    const DELAYED          = 'Delayed';
    const CANCELLED        = 'Cancelled';

    const ALL = [
        self::CREATED,
        self::DISPATCHED,
        self::IN_TRANSIT,
        self::OUT_FOR_DELIVERY,
        self::DELIVERED,
        self::DELAYED,
        self::CANCELLED,
    ];
}