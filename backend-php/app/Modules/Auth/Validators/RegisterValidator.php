<?php

namespace App\Modules\Auth\Validators;

use Illuminate\Support\Facades\Validator;
use App\Constants\Roles;

class RegisterValidator
{
    public static function validate(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make($data, [
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'role'                  => 'sometimes|in:' . implode(',', Roles::ALL),
        ]);
    }
}