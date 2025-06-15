import Image from 'next/image'
import React from 'react'

const ContactInfo = () => {
  return (
    <div className='text-white raleway w-full'>
        <section className='lg:w-[280px] lg:h-[62px] md:w-[440px] md:h-[112px] w-[370px] h-[85px] relative'>
            <Image src="/images/lasieste.svg" fill alt='lasieste'/>
        </section>
        <div className='py-6 lg:border-b-1 space-y-1'>
            <section className='flex text-[13px] gap-1 whitespace-nowrap'>
                <p className='font-bold'>Add:</p> 180 -188 Ly Tu Trong St., District 1 , Ho Chi Minh, Vietnam
            </section>
            <section className='text-[13px] flex gap-1 whitespace-nowrap'>
                <p className='font-bold'>Phone:</p> +84 28 3535 4461 
                <p className='font-bold'>Hotline:</p> +84 773 548 331
            </section>
            <section className='text-[13px] flex gap-1 whitespace-nowrap'>
                <p className='font-bold'>Email:</p> saigon@lasiestahotels.com
            </section>            
        </div>

        <div className='max-lg:border-1 w-full'></div>

        <section className='py-6 flex gap-12 max-h-[100px]'>
            <div className='space-y-2'>
                <p className='playfair text-[#BF882E]'>FIND US ON</p>
                <div className='flex gap-2'>
                    <Image src="/icons/facebook.svg" className='brightness-0 invert' width={30} height={30} alt='facebook'/>
                    <Image src="/icons/instagram.svg" className='brightness-0 invert' width={30} height={30} alt='instagram'/>
                    <Image src="/icons/youtube.svg" className='brightness-0 invert' width={42} height={42} alt='youtube'/>
                </div>
            </div>
            <div className='space-y-2'>
                <p className='playfair text-[#BF882E]'>A member of</p>
                <Image src="/images/Elegance Hospitality Group.svg" className='-translate-x-9 -translate-y-6 brightness-0 invert' width={200} height={200} alt='youtube'/>
            </div>
        </section>
    </div>
  )
}

export default ContactInfo