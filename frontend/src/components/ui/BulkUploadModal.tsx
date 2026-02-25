"use client"
import Image from "next/image"
import BasicButton from "./BasicButton"
import { ModalProps, BulkUploadResponse } from "@/src/types/types"
import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { shipmentService } from "@/src/services/shipmentService"

const BulkUploadModal = ({ onClose }: ModalProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BulkUploadResponse | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const validateFile = (f: File): string | null => {
    if (!f.name.toLowerCase().endsWith(".csv")) return "Only .csv files are accepted."
    if (f.size > 10 * 1024 * 1024) return "File exceeds 10 MB limit."
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const err = validateFile(f)
    setError(err)
    setResult(null)
    setFile(err ? null : f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    const err = validateFile(f)
    setError(err)
    setResult(null)
    setFile(err ? null : f)
  }

  const handleUpload = async () => {
    if (!file) { setError("Please select a CSV file first."); return }
    setIsUploading(true)
    setError(null)
    try {
      const response = await shipmentService.bulkUpload(file)
      setResult(response)
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <motion.div
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "Inter" }}
        initial={{ opacity: 0, filter: "blur(10px)", scale: 1 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: [1.5, 1] }}
        exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
        transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
        className="md:w-[540px] p-8 flex flex-col items-center bg-white border border-[#E2E8F0] rounded-2xl gap-5 shadow-xl mx-4"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F5F9FF]">
          <Image src="/icons/upload.svg" alt="upload" width={20} height={20} />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[22px] font-bold text-[#0F172A]">Bulk Upload Shipments</span>
          <span className="text-[14px] text-[#64748B] mt-1">
            Upload a CSV file to create multiple shipments at once.
          </span>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`w-full min-h-[160px] flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${isDragOver ? "border-slate-400 bg-slate-50" : "border-[#E2E8F0] hover:border-slate-300"
            }`}
        >
          <input ref={inputRef} id="csvUpload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          <Image src="/icons/file.svg" alt="file" width={24} height={24} />
          {file ? (
            <div className="text-center">
              <p className="text-[14px] font-semibold text-[#0F172A]">{file.name}</p>
              <p className="text-[12px] text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB — Ready to upload</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[14px] text-slate-500">Drag &amp; drop your CSV file here</p>
              <p className="text-[13px] text-slate-400">or <span className="font-semibold text-[#0F172A]">browse files</span> — max 10 MB</p>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {/* Result Summary */}
        {result && (
          <div className="w-full rounded-xl border border-[#E2E8F0] overflow-hidden">
            <div className={`px-4 py-3 flex items-center justify-between ${result.error_count > 0 ? "bg-amber-50 border-b border-amber-100" : "bg-green-50 border-b border-green-100"}`}>
              <span className={`text-[13px] font-bold ${result.error_count > 0 ? "text-amber-700" : "text-green-700"}`}>
                ✓ {result.successful_count}/{result.total_processed} shipments imported
                {result.error_count > 0 && ` · ${result.error_count} failed`}
              </span>
            </div>
            {result.errors.length > 0 && (
              <div className="max-h-[140px] overflow-y-auto divide-y divide-slate-100">
                {result.errors.map((e, i) => (
                  <div key={i} className="px-4 py-2.5">
                    <p className="text-[12px] font-bold text-[#0F172A]">Row {e.row} — {e.shipment_id || "Unknown"}</p>
                    <p className="text-[11.5px] text-red-500">{e.issues.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 w-full">
          <BasicButton
            onClick={onClose}
            text={result ? "Close" : "Cancel"}
            className="border border-[#E2E8F0] py-2 px-6 rounded-lg cursor-pointer hover:bg-slate-50 text-[14px]"
          />
          {!result && (
            <BasicButton
              onClick={handleUpload}
              text={isUploading ? "Uploading…" : "Upload & Process"}
              disabled={isUploading || !file}
              className="bg-black text-white py-2 px-6 rounded-lg cursor-pointer text-[14px] hover:bg-black/80 disabled:opacity-50"
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default BulkUploadModal
