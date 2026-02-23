<?php

namespace App\Modules\CsvUpload\Repositories;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Utils\DateHelper;

class CsvUploadRepository
{
    public function saveLog(array $data): string
    {
        $id = (string) Str::uuid();
        DB::table('csv_upload_logs')->insert([
            'id'            => $id,
            'uploaded_by'   => $data['uploaded_by'],
            'total_rows'    => $data['total_rows'],
            'success_count' => $data['success_count'],
            'error_count'   => $data['error_count'],
            'errors'        => json_encode($data['errors']),
            'created_at'    => DateHelper::nowUtc(),
            'updated_at'    => DateHelper::nowUtc(),
        ]);
        return $id;
    }

    public function getLogs(int $perPage = 10)
    {
        return DB::table('csv_upload_logs')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}