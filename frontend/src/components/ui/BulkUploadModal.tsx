"use client"
import Image from "next/image"
import BasicButton from "./BasicButton"
import { ModalProps, BulkUploadResponse } from "@/src/types/types"
import { useEffect, useState } from "react"
import { motion, useAnimate } from "motion/react"
import { shipmentService } from "@/src/services/shipmentService"



const BulkUploadModal = ({ onClose }: ModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkUploadResponse | null>(null);

  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate(".box", {
      opacity: 1,
      filter: "blur(0px)",
      scale: [1.5, 1],
    }, {
      duration: 0.5,
      ease: "easeInOut",
      type: "spring"
    })
  }, [])

  const exitAnimation = async () => {
    await animate(".box", {
      opacity: 0,
      filter: "blur(10px)",
      scale: 0
    }, {
      duration: 0.5,
      ease: "easeIn"
    })

    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await shipmentService.bulkUpload(file);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={scope}
      className="fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* MODAL */}
      <motion.div
        style={{
          fontFamily: "Inter",
          opacity: 0,
          filter: "blur(10px)"
        }}
        className="md:w-130 p-8 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-xl gap-2 box">
        {/* ICON */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F5F9FF]">
          <Image src="/icons/upload.svg" alt="upload" width={20} height={20} />
        </div>
        {/* HEADER */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="pb-2 text-[24px]/[32px] font-bold">
            Bulk Upload Shipments
          </span>
          <span className="text-[16px]/[24px] text-[#64748B]">
            Upload a CSV file to create or update multiple shipments at once.
          </span>
        </div>
        {/* UPLOAD FILE SECTION */}
        <label className="w-[90%] h-[246.5px] flex flex-col items-center justify-center gap-2 border border-[#E2E8F0] rounded-xl p-5 cursor-pointer">
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          <span>
            <Image src="/icons/file.svg" alt="upload file" width={20} height={20} />
          </span>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[#64748B] text-base">
              {file ? file.name : "Drag or drop your CSV file here"}
            </span>
            {!file && (
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm text-black">or</span>
                <span className="text-sm text-black font-semibold">Browse Files</span>
              </div>
            )}
            <span className="text-xs text-[#64748B]">Max file size: 10MB</span>
            {error && <span className="text-xs text-red-500 mt-2">{error}</span>}
            {result && (
              <span className="text-xs text-green-600 mt-2">
                Successfully processed {result.successful_count} of {result.total_processed} records.
                {result.error_count > 0 && ` Failed: ${result.error_count}.`}
              </span>
            )}
          </div>
        </label>
        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-center gap-2">
          <BasicButton onClick={() => {
            exitAnimation()
          }} disabled={loading} text={result ? "Close" : "Cancel"} className="text-black bg-white border border-[#E2E8F0] py-4 px-4 rounded-lg cursor-pointer text-sm md:text-base" />
          {!result && (
            <BasicButton onClick={handleUpload} disabled={loading || !file} text={loading ? "Uploading..." : "Upload and Process"} className={`${file ? 'bg-black' : 'bg-slate-300'} text-white py-4 px-4 rounded-lg cursor-pointer text-sm md:text-base`} />
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default BulkUploadModal
