<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Only run if password_hash exists and password does not
            if (
                Schema::hasColumn('users', 'password_hash') &&
                !Schema::hasColumn('users', 'password')
            ) {
                $table->renameColumn('password_hash', 'password');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'password')) {
                $table->renameColumn('password', 'password_hash');
            }
        });
    }
};