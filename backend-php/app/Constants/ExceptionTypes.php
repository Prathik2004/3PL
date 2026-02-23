<?php

namespace App\Constants;

class ExceptionTypes
{
    const DELAY          = 'Delay';
    const NO_UPDATE      = 'NoUpdate';
    const MISSING_POD    = 'MissingPOD';
    const NOT_DISPATCHED = 'NotDispatched';

    const ALL = [
        self::DELAY,
        self::NO_UPDATE,
        self::MISSING_POD,
        self::NOT_DISPATCHED,
    ];
}