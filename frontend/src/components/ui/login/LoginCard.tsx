"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BasicInput from '../BasicInput'
import RoleSlider from './RoleSlider'
import BasicButton from '../BasicButton'
import { Roles } from '@/src/types/types'
import { useAuth } from '@/src/lib/context/AuthContext'
import { AppApiError } from '@/src/lib/errors/AppError'

const LoginCard = () => {
    const router = useRouter()
    const { login } = useAuth()
    
    const [selectedRole, setSelectedRole] = useState<Roles>("Viewer");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const rolePlaceholder={
    "Viewer": "e12345@walkwel.com",
    "Admin" : "admin@walkwel.com",
    "Operations": "op1234@walkwel.com"
    }

    const handleLogin = async () => {
      setErrorMsg("");
      
      if (!email || !password) {
        setErrorMsg("Please enter both email and password.");
        return;
      }

      setIsLoggingIn(true);
      try {
        await login({ email, password });
        router.push("/dashboard/overview"); // Redirect to dashboard heavily requested feature
      } catch (err) {
        if (err instanceof AppApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("An unexpected error occurred. Please try again.");
        }
      } finally {
        setIsLoggingIn(false);
      }
    };

  return (
    <div className='shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] p-8 border border-[#E2E8F0] rounded-xl flex flex-col'>
        {/* HEADING */}
      <div className='flex flex-col text-left mb-10'>
        <span className='text-[22px]/[28px] font-bold'>Welcome back</span>
        <span className='text-[14px]/[20px] text-[#64748B]'>Please enter your details to sign in</span>
      </div>
      
      {/* ERROR MSG */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      {/* INPUTS AND SLIDER */}
      <div className='flex flex-col gap-5 mb-5'>
        <BasicInput 
          text="Username/Email" 
          placeholder={`e.g. ${rolePlaceholder[selectedRole]}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <BasicInput 
          type="password" 
          text="Password" 
          placeholder="•••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <RoleSlider selectedRole={selectedRole} setSelectedRole={setSelectedRole}  />
      </div>
      <BasicButton 
        onClick={handleLogin}
        disabled={isLoggingIn}
        text={isLoggingIn ? "Signing In..." : "Sign In"} 
        className='w-full bg-black text-white p-4 rounded-lg hover:bg-black/70 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center' 
      />
    </div>
  )
}

export default LoginCard
