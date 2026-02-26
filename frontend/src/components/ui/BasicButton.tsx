import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface BasicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string; // Made optional since you're passing children now
    className?: string;
    children?: ReactNode; // Added this to fix the TS error
}

const BasicButton = ({ text, className = "", children, ...props }: BasicButtonProps) => {
  return (
    <button 
      className={`flex items-center justify-center transition-all outline-none ${className ? className : 'w-[142px] h-[46px] py-3 px-12 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 cursor-pointer'}`}
      {...props}
    >
      {/* Render children if they exist, otherwise render the text prop */}
      {children ? children : <span className="text-[14px] leading-none">{text}</span>}
    </button>
  )
}

export default BasicButton;