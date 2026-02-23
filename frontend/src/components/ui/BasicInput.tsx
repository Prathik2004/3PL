
interface BasicInputProps{
  text?: string;
  placeholder?: string;
}

const BasicInput = ({text, placeholder}: BasicInputProps) => {
  return (
    <div 
    style={{
      fontFamily: "Inter"
    }}
    className={`flex flex-col`}>
      <span className="text-[12px]/[16px] text-[#64748B]">{text}</span>
      <input className="md:w-97.75 w-full h-11 border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#E2E8F0] rounded-lg py-3.25 px-4 text-[14px]" type="text" placeholder={placeholder} />
    </div>
  )
}

export default BasicInput
