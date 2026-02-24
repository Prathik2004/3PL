<?php

namespace App\Modules\Auth\Validators;

use Illuminate\Support\Facades\Validator;

class LoginValidator
{
    public static function validate(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make($data, [
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);
    }
}