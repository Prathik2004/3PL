
interface BasicDropDownInputProps {
  text: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[]
}

const BasicDropDownInput = ({ text, value, options, onChange }: BasicDropDownInputProps) => {
  return (
    <div
      style={{
        fontFamily: "Inter"
      }}
      className={`flex flex-col`}>
      <span onChange={onChange} 
      className="text-[12px]/[16px] text-[#64748B]">{text}</span>
      <div className="relative">
  <select
    value={value}
    onChange={onChange}
    className=" w-full h-11 bg-white border border-slate-200 rounded-lg px-4 pr-10 text-sm text-slate-700 appearance-none outline-none transition-all duration-200 hover:border-slate-300 focus:border-black">
    {options?.map((option, idx) => (
      <option key={idx} value={option}>
        {option}
      </option>
    ))}
  </select>

  {/* Custom Arrow */}
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
</div>
    </div>
  )
}


export default BasicDropDownInput