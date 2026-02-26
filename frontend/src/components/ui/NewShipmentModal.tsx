"use client"
import Image from "next/image"
import BasicInput from "./BasicInput"
import BasicButton from "./BasicButton"
import { ModalProps, CreateShipmentPayload } from "@/src/types/types"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import BasicDropDownInput from "./BasicDropDownInput"
import { shipmentService } from "@/src/services/shipmentService"

const NewShipmentModal = ({ onClose }: ModalProps) => {

  const StatusOptions = ["Created", "In Transit", "Dispatched", "Delayed", "Delivered"]

  const [shipmentId, setShipmentId] = useState("")
  const [client, setClient] = useState("")
  const [carrier, setCarrier] = useState("")
  const [originAddress, setOriginAddress] = useState("")
  const [dest, setDest] = useState("")
  const [dispatchDate, setDispatchDate] = useState("")
  const [expDel, setExpDel] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleCreate = async () => {
    setError(null)

    // Basic validation
    if (!shipmentId.trim() || !client.trim() || !carrier.trim() || !originAddress.trim() || !dest.trim() || !dispatchDate || !expDel) {
      setError("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: CreateShipmentPayload = {
        shipment_id: shipmentId.trim(),
        client_name: client.trim(),
        carrier_name: carrier.trim(),
        origin: originAddress.trim(),
        destination: dest.trim(),
        dispatch_date: new Date(dispatchDate).toISOString(),
        expected_delivery_date: new Date(expDel).toISOString(),
      }
      await shipmentService.createShipment(payload)
      setSuccess(true)
      setTimeout(() => onClose(), 1000)
    } catch (err: any) {
      setError(err.message || "Failed to create shipment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ fontFamily: "Inter" }}
      className="w-full rounded-xl border border-[#E2E8F0] fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0 }}
        animate={{ scale: [1.5, 1], filter: "blur(0px)", opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(10px)", scale: 0 }}
        transition={{ duration: 0.5, type: "spring", ease: "easeIn" }}
        className="flex flex-col"
      >
        {/* HEADER */}
        <div className="bg-[#E2E8F0] py-5 px-8 rounded-t-xl flex items-center justify-between">
          <div className="w-[70%] flex flex-col">
            <span className="text-[22px]/[28px] font-bold">Create New Shipment</span>
            <span className="text-[12px] text-[#64748B]">Initialize a new logistics entry for the 3PL system.</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer">
            <Image src="/icons/cross.svg" alt="close" width={10} height={10} />
          </button>
        </div>

        {/* ERROR / SUCCESS BANNER */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-600 text-[13px] px-8 py-3">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border-b border-green-200 text-green-600 text-[13px] px-8 py-3">
            ✓ Shipment created successfully!
          </div>
        )}

        {/* CONTENT */}
        <div className="flex md:flex-row flex-col items-start justify-between gap-5 py-8 px-12 bg-white">
          {/* LOGISTICS */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image src="/icons/logictics.svg" alt="logistics" width={10} height={10} />
              <span className="text-[14px]/[20px] text-black">LOGISTICS BASICS</span>
            </div>
            <BasicInput text="Shipment ID *" value={shipmentId} placeholder="#SHP-77241-LX" onChange={(e) => setShipmentId(e.target.value)} />
            <BasicInput text="Client Name *" value={client} placeholder="Enter client name" onChange={(e) => setClient(e.target.value)} />
            <BasicInput text="Carrier Name *" value={carrier} placeholder="Enter carrier name" onChange={(e) => setCarrier(e.target.value)} />
          </div>

          {/* TIMELINE & ROUTE */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image src="/icons/timeline.svg" alt="timeline" width={10} height={10} />
              <span className="text-[14px]/[20px] text-black">TIMELINE &amp; ROUTE</span>
            </div>
            <BasicInput text="Origin Address *" value={originAddress} placeholder="Enter origin address" onChange={(e) => setOriginAddress(e.target.value)} />
            <BasicInput text="Destination Address *" value={dest} placeholder="Enter destination" onChange={(e) => setDest(e.target.value)} />
            <BasicInput type="datetime-local" text="Dispatch Date *" value={dispatchDate} placeholder="mm/dd/yy" onChange={(e) => setDispatchDate(e.target.value)} />
            <BasicInput type="datetime-local" text="Expected Delivery *" value={expDel} placeholder="mm/dd/yy" onChange={(e) => setExpDel(e.target.value)} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#E2E8F0] flex items-center justify-end rounded-b-xl py-5 px-8">
          <div className="flex items-center gap-2">
            <BasicButton onClick={onClose} className="text-black bg-white border border-[#E2E8F0] py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-50" text="Cancel" />
            <BasicButton
              onClick={handleCreate}
              disabled={isSubmitting || success}
              className="bg-black text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-black/80 disabled:opacity-50 active:scale-95"
              text={isSubmitting ? "Creating…" : success ? "Created ✓" : "Create Shipment"}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NewShipmentModal
