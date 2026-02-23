<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExceptionDetectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $shipmentId,
        public string $exceptionType,
        public string $reason,
        public string $status
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Exception Detected — Shipment {$this->shipmentId}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.exception-detected',
            with: [
                'shipmentId'    => $this->shipmentId,
                'exceptionType' => $this->exceptionType,
                'reason'        => $this->reason,
                'status'        => $this->status,
            ]
        );
    }
}