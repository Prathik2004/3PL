import Image from "next/image"

const ExportButton = () => {
  return (
    <button 
    style={{
        fontFamily: "Inter"
    }}
    className="w-[110.35px] h-9 py-2 px-6 flex items-center justify-center bg-[#E2E8F0] border border-[#E2E8F0] rounded-lg gap-2">
      <Image src="/icons/download.svg" alt="Export" width={10} height={10} />
      <span className="text-black text-[14px]">Export</span>
    </button>
  )
}

export default ExportButton
