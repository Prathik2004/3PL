import Image from "next/image"

const NewShipmentButton = () => {
  return (
    <button className="w-[164.35px] h-9 rounded-lg flex items-center justify-center gap-2 bg-[#0F172A]">
    <Image src="/icons/add.svg" alt="Plus" width={10} height={10} />
    <span className="text-white text-[14px]" >New Shipment</span>
    </button>
  )
}

export default NewShipmentButton
