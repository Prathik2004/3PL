<?php

namespace App\Modules\CsvUpload\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CsvUpload\Services\CsvUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CsvUploadController extends Controller
{
    public function __construct(
        private CsvUploadService $service
    ) {}

    public function upload(Request $request): JsonResponse
    {
        return $this->service->upload($request, auth('api')->id());
    }

    public function logs(Request $request): JsonResponse
    {
        return $this->service->logs($request);
    }
}