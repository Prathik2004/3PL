"use client"
import Image from "next/image"
import BasicButton from "./BasicButton"
import { ModalProps, BulkUploadResponse } from "@/src/types/types"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { shipmentService } from "@/src/services/shipmentService"

const BulkUploadModal = ({ onClose }: ModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkUploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    setResult(null);

    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a CSV file.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };


  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const response = await shipmentService.bulkUpload(file);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div onClick={onClose}
      className="fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* MODAL */}
      <motion.div onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: "Inter",
          opacity: 0,
          filter: "blur(10px)"
        }}
        initial={{
          opacity: 0,
          filter: "blur(10px)",
          scale: 1
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          scale: [1.5, 1]
        }}
        exit={{
          opacity: 0,
          scale: 0,
          filter: "blur(10px)"
        }}
        transition={{
          type: "spring",
          duration: 0.5,
          ease: "easeInOut"
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
          <BasicButton onClick={onClose} text="Cancel" className="" />
          <BasicButton
            onClick={handleUpload}
            text={isUploading ? "Uploading..." : "Upload and Process"}
            disabled={isUploading || !file}
            className={`bg-black text-white py-4 px-4 rounded-lg cursor-pointer text-sm md:text-base ${isUploading || !file ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default BulkUploadModal
