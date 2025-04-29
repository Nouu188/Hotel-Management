'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SocialAuthForm from '@/components/form/SocialAuthForm'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isSignup = pathname.includes('sign-up'); 
  const heightClass = isSignup ? 'h-[630px]' : 'h-[553px]';
  const translateClass = isSignup ? 'translate-y-5' : "";

  return (
    <div className={`flex justify-center items-center min-h-screen bg-no-repeat`}>
        <Image
          src="/images/5.jpg"
          fill
          className='absolute object-cover w-full'
          alt='layout auth'
        />
        
        <div className={`flex absolute w-[494px] ${heightClass} ${translateClass} transition-all duration-300 bg-[#FFFFFF] shadow-md opacity-[0.66] rounded-xl`} />

        <section className={`z-20 ${translateClass} min-w-full flex-col rounded-sm px-4 py-10 sm:min-w-[520px] sm:px-8`}>
              <div className='flex gap-1'>
                <p className='font-semibold text-2xl'>Join</p>
                <p className='font-bold text-2xl'>La Roche</p>
              </div>
            
              {children}  
              <SocialAuthForm />
        </section>
    </div>
  )
}

export default AuthLayout;
