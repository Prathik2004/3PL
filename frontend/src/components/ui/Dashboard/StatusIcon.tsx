import { StatusIconProps } from "@/src/types/types";

const statusData = [
  {
    text: "CREATED",
    bgColor: "#DBEAFE",
    color: "#1E40AF"
  },
  {
    text: "DISPATCHED",
    bgColor: "#E2E8F0",
    color: "#0F172A"
  },
  {
    text: "Delivered",
    bgColor: "#DCFCE7",
    color: "#166534"
  },
  {
    text: "DELAYED",
    bgColor: "#DC2626",
    color: "#FFE8E8"
  },
  {
    text: "IN TRANSIT",
    bgColor: "#DBEAFE",
    color: "#1E40AF"
  }
]

const StatusIcon = ({ text }: StatusIconProps) => {

  const statusProps = statusData.find((data) => text.toLowerCase() == data.text.toLowerCase())

  return (
    <div
      style={{
        backgroundColor: statusProps?.bgColor ?? "#E2E8F0"
      }}
      className={`w-[87.59px] h-5 rounded-full flex items-center justify-center`}>
      <span
        style={{
          fontFamily: "Inter",
          color: statusProps?.color ?? "#0F172A"
        }}
        className={` text-[12px]`}>
        {text.toUpperCase()}
      </span>
    </div>
  )
}

export default StatusIcon;
