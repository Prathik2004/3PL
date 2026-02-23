import Image from "next/image"
import BasicButton from "./BasicButton"

const BulkUploadModal = () => {
  return (
    <div 
    className="fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm">
        {/* MODAL */}
      <div
      style={{
        fontFamily: "Inter"
        }} 
      className="md:w-130 p-8 flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-xl gap-2">
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
        //   onChange={handleFileChange}
        />
            <span>
                <Image src="/icons/file.svg" alt="upload file" width={20} height={20} />
            </span>
            <div className="flex flex-col items-center justify-center">
                <span className="text-[#64748B] text-base">
                    Drag or drop your CSV file here
                </span>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-black">or</span>
                    <span className="text-sm text-black font-semibold">Browse Files</span>
                </div>
                <span className="text-xs text-[#64748B]">Max file size: 10MB</span>
            </div>
        </label>
        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-center gap-2">
            <BasicButton text="Cancel" className="" />
            <BasicButton text="Upload and Process" className="bg-black text-white py-4 px-4 rounded-lg cursor-pointer text-sm md:text-base" />
        </div>
      </div>
    </div>
  )
}

export default BulkUploadModal
