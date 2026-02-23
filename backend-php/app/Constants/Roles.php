<?php

namespace App\Constants;

class Roles
{
    const ADMIN      = 'Admin';
    const OPERATIONS = 'Operations';
    const VIEWER     = 'Viewer';

    const ALL = [
        self::ADMIN,
        self::OPERATIONS,
        self::VIEWER,
    ];
}