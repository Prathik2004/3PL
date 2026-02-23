<?php

namespace App\Modules\CsvUpload\Services;

use App\Modules\CsvUpload\Repositories\CsvUploadRepository;
use App\Modules\CsvUpload\Validators\CsvUploadValidator;
use App\Modules\Shipment\Models\Shipment;
use App\Utils\ResponseHelper;
use App\Utils\DateHelper;
use App\Constants\ShipmentStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;

class CsvUploadService
{
    public function __construct(
        private CsvUploadRepository $repository
    ) {}

    public function upload(Request $request, string $userId): JsonResponse
    {
        // Validate file
        $fileValidator = CsvUploadValidator::validateFile($request->all());
        if ($fileValidator->fails()) {
            return ResponseHelper::validationError(
                $fileValidator->errors()->toArray()
            );
        }

        $file   = $request->file('file');
        $csv    = Reader::createFromPath($file->getPathname(), 'r');
        $csv->setHeaderOffset(0);

        $records      = iterator_to_array($csv->getRecords());
        $totalRows    = count($records);
        $successCount = 0;
        $errorCount   = 0;
        $errors       = [];

        foreach ($records as $index => $row) {
            $rowNumber = $index + 2; // row 1 is header
            $row       = array_map('trim', $row);

            // Validate row
            $validator = CsvUploadValidator::validateRow($row);

            if ($validator->fails()) {
                $errors[] = [
                    'row'         => $rowNumber,
                    'shipment_id' => $row['shipment_id'] ?? null,
                    'error'       => implode(', ', $validator->errors()->all()),
                ];
                $errorCount++;
                continue;
            }

            // Check duplicate
            $exists = Shipment::where('shipment_id', $row['shipment_id'])->exists();
            if ($exists) {
                $errors[] = [
                    'row'         => $rowNumber,
                    'shipment_id' => $row['shipment_id'],
                    'error'       => 'Duplicate shipment_id',
                ];
                $errorCount++;
                continue;
            }

            // Save shipment
            $shipmentId = (string) Str::uuid();
            Shipment::create([
                'id'                     => $shipmentId,
                'shipment_id'            => $row['shipment_id'],
                'client_name'            => $row['client_name'],
                'origin'                 => $row['origin'],
                'destination'            => $row['destination'],
                'dispatch_date'          => $row['dispatch_date'],
                'expected_delivery_date' => $row['expected_delivery_date'],
                'carrier_name'           => $row['carrier_name'],
                'pod_received'           => filter_var($row['pod_received'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'status'                 => ShipmentStatus::CREATED,
                'last_status_update'     => DateHelper::nowUtc(),
                'created_by'             => $userId,
            ]);

            // Log status
            DB::table('shipment_logs')->insert([
                'id'          => (string) Str::uuid(),
                'shipment_id' => $row['shipment_id'],
                'old_status'  => null,
                'new_status'  => ShipmentStatus::CREATED,
                'changed_by'  => $userId,
                'created_at'  => DateHelper::nowUtc(),
                'updated_at'  => DateHelper::nowUtc(),
            ]);

            $successCount++;
        }

        // Save upload log
        $logId = $this->repository->saveLog([
            'uploaded_by'   => $userId,
            'total_rows'    => $totalRows,
            'success_count' => $successCount,
            'error_count'   => $errorCount,
            'errors'        => $errors,
        ]);

        return ResponseHelper::success('CSV processed successfully', [
            'total_rows'         => $totalRows,
            'success_count'      => $successCount,
            'error_count'        => $errorCount,
            'errors'             => $errors,
            'processing_log_id'  => $logId,
        ]);
    }

    public function logs(Request $request): JsonResponse
    {
        $perPage  = (int) $request->get('per_page', 10);
        $paginator = $this->repository->getLogs($perPage);

        return ResponseHelper::paginated(
            'Upload logs retrieved',
            $paginator,
            collect($paginator->items())->toArray()
        );
    }
}