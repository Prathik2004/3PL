import React, { ButtonHTMLAttributes } from 'react';

export interface BasicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    className?: string;
}

const BasicButton = ({ text, className = "", ...props }: BasicButtonProps) => {
  return (
    <button 
      className={`flex items-center justify-center transition-all outline-none ${className ? className : 'w-[142px] h-[46px] py-3 px-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
      {...props}
    >
      <span className="text-[14px] leading-none">{text}</span>
    </button>
  )
}

export default BasicButton;
