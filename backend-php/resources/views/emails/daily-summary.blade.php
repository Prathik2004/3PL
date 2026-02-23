<x-mail::message>
@component('mail::message')
# Daily Exception Summary

Total active exceptions today: **{{ $totalCount }}**

@if(count($exceptions) > 0)
@component('mail::table')
| Shipment ID | Type | Status | Reason |
|---|---|---|---|
@foreach($exceptions as $e)
| {{ $e->shipment_id }} | {{ $e->exception_type }} | {{ $e->status }} | {{ $e->reason }} |
@endforeach
@endcomponent
@else
No active exceptions today.
@endif

@component('mail::button', ['url' => config('app.url')])
View Dashboard
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent
</x-mail::message>
