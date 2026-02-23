interface BasicButtonProps{
    text: string;
    className?: string
}

const BasicButton = ({text, className}: BasicButtonProps) => {
  return (
    <button className={`${className} w-35.5 h-11.5 py-3 px-12 rounded-lg flex items-center justify-center`}>
      <span className="text-[14px]"> {text} </span>
    </button>
  )
}

export default BasicButton
