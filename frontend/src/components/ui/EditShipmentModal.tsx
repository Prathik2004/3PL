"use client"
import Image from "next/image"
import BasicInput from "./BasicInput"
import BasicButton from "./BasicButton"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import BasicDropDownInput from "./BasicDropDownInput"
import { shipmentService } from "@/src/services/shipmentService"

interface EditShipmentModalProps {
  shipmentId?: string;    // Human-readable (display only)
  internalId: string;     // UUID for the PUT API call
  client?: string;
  carrier?: string;
  status?: string;
  origin?: string;
  dest?: string;
  onClose?: () => void;
}

const STATUS_OPTIONS = ["Created", "Dispatched", "In Transit", "Out for Delivery", "Delivered", "Delayed"]

const EditShipmentModal = ({
  shipmentId, internalId, client, carrier, status, origin, dest, onClose
}: EditShipmentModalProps) => {

  // Pre-populate from props
  const [currentStatus, setCurrentStatus] = useState(status || "Created")
  const [deliveredDate, setDeliveredDate] = useState("")
  const [podReceived, setPodReceived] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.() }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleSave = async () => {
    setError(null)

    if (!currentStatus) {
      setError("Please select a status.")
      return
    }

    // Require delivered date when marking as Delivered
    if (currentStatus === "Delivered" && !deliveredDate) {
      setError("Please provide the delivered date when marking as Delivered.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: { status: string; delivered_date?: string; pod_received?: boolean } = {
        status: currentStatus,
        pod_received: podReceived,
      }
      if (currentStatus === "Delivered" && deliveredDate) {
        payload.delivered_date = new Date(deliveredDate).toISOString()
      }

      await shipmentService.updateShipmentStatus(internalId, payload)
      setSuccess(true)
      setTimeout(() => onClose?.(), 1000)
    } catch (err: any) {
      setError(err.message || "Failed to update shipment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ fontFamily: "Inter" }}
      className="w-full fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, filter: "blur(10px)", scale: 1 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: [1.5, 1] }}
        exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
        transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col"
      >
        {/* HEADER */}
        <div className="bg-[#E2E8F0] py-5 px-8 rounded-t-xl flex items-center justify-between">
          <div className="w-[70%] flex flex-col">
            <span className="text-[22px]/[28px] font-bold">Edit Shipment {shipmentId}</span>
            <span className="text-[12px] text-[#64748B]">Update status and delivery details.</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer">
            <Image src="/icons/cross.svg" alt="close" width={10} height={10} />
          </button>
        </div>

        {/* ERROR / SUCCESS */}
        {error && <div className="bg-red-50 border-b border-red-200 text-red-600 text-[13px] px-8 py-3">{error}</div>}
        {success && <div className="bg-green-50 border-b border-green-200 text-green-600 text-[13px] px-8 py-3">✓ Shipment updated successfully!</div>}

        {/* CONTENT */}
        <div className="flex md:flex-row flex-col items-start justify-between gap-8 py-8 px-12 bg-white min-w-[640px]">

          {/* READ-ONLY DETAILS */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image src="/icons/logictics.svg" alt="logistics" width={10} height={10} />
              <span className="text-[14px]/[20px] text-black font-semibold">SHIPMENT DETAILS</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B] font-medium uppercase tracking-wide">Shipment ID</span>
              <span className="text-[14px] font-bold text-[#0F172A]">{shipmentId || "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B] font-medium uppercase tracking-wide">Client</span>
              <span className="text-[14px] text-[#0F172A]">{client || "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B] font-medium uppercase tracking-wide">Carrier</span>
              <span className="text-[14px] text-[#0F172A]">{carrier || "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#64748B] font-medium uppercase tracking-wide">Route</span>
              <span className="text-[14px] text-[#0F172A]">{origin} → {dest}</span>
            </div>
          </div>

          {/* EDITABLE FIELDS */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image src="/icons/timeline.svg" alt="timeline" width={10} height={10} />
              <span className="text-[14px]/[20px] text-black font-semibold">UPDATE STATUS</span>
            </div>
            <BasicDropDownInput
              text="New Status"
              value={currentStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => setCurrentStatus(e.target.value)}
            />
            {currentStatus === "Delivered" && (
              <BasicInput
                type="datetime-local"
                text="Delivered Date *"
                value={deliveredDate}
                placeholder="mm/dd/yy"
                onChange={(e) => setDeliveredDate(e.target.value)}
              />
            )}
            {/* POD toggle */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPodReceived(!podReceived)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${podReceived ? "bg-green-500" : "bg-[#64748B]"}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0 transition-transform duration-200 ${podReceived ? "translate-x-5" : "translate-x-0"}`} />
              </button>
              <span className="text-[13px] text-[#64748B]">POD Received</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#E2E8F0] flex items-center justify-end rounded-b-xl py-5 px-8 gap-2">
          <BasicButton onClick={onClose} className="text-black bg-white border border-[#E2E8F0] py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-50" text="Cancel" />
          <BasicButton
            onClick={handleSave}
            disabled={isSubmitting || success}
            className="bg-black text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-black/80 disabled:opacity-50 active:scale-95"
            text={isSubmitting ? "Saving…" : success ? "Saved ✓" : "Save Changes"}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default EditShipmentModal
