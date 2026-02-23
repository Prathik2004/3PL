<x-mail::message>
@component('mail::message')
# Exception Detected

A new exception has been flagged in the system.

| Field | Details |
|---|---|
| Shipment ID | {{ $shipmentId }} |
| Exception Type | {{ $exceptionType }} |
| Current Status | {{ $status }} |

**Reason:**
{{ $reason }}

@component('mail::button', ['url' => config('app.url')])
View Dashboard
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent
</x-mail::message>
