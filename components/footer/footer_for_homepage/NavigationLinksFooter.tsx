import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { hotelBranches } from '@/constants/hotelBranches';
import Image from 'next/image';
import React from 'react'

const Hotel = [
    {
        id: 1,
        name: "Rooms & Suites"
    },
    {
        id: 2,
        name: "Meeting Room"
    },
    {
        id: 3,
        name: "Swimming Pool"
    },
    {
        id: 4,
        name: "Gym"
    },
    {
        id: 5,
        name: "Loyal Guest"
    },
    {
        id: 6,
        name: "Location & Map"
    },
    {
        id: 7,
        name: "Saigon Travel Guide"
    },
];

const Dining = [
    {
        id: 1,
        name: "Cloud Nine SaiGon"
    },
    {
        id: 2,
        name: "Twilight Sky Bar Saigon"
    },
    {
        id: 3,
        name: "In-room Dining"
    }
];

const Services = [
    {
        id: 1,
        name: "La Spa"
    },
    {
        id: 2,
        name: "Tours"
    },
    {
        id: 3,
        name: "Via On Arrival"
    },
    {
        id: 4,
        name: "Transfer Services"
    }
];

const Policy = [
    {
        id: 1,
        name: "Legal Policy"
    },
    {
        id: 2,
        name: "Cookie Policy"
    },
    {
        id: 3,
        name: "Best Rate Guarantee"
    }
];

const AboutUs = [
    {
        id: 1,
        name: "EHG News"
    },
    {
        id: 2, 
        name: "About EHG"
    },
    {
        id: 3, 
        name: "Contact Us"
    },
];
const NavigationLinksFooter = () => {
  return (
    <div className='text-[13px] text-white raleway w-full'>
        <div className='max-lg:hidden'>
            <section className='flex gap-14 max-xl:gap-3'>
                <div className='space-y-5'>
                    <h1 className='text-[16px] text-[#BF882E]'>HOTEL</h1>
                    {Hotel.map((item) => (
                        <p key={item.id} className="whitespace-nowrap">{item.name}</p>
                    ))}                    
                </div>
                <div className='space-y-5'>
                        <h1 className='text-[16px] text-[#BF882E]'>DINING</h1>
                        {Dining.map((item) => (
                            <p key={item.id} className="whitespace-nowrap">{item.name}</p>
                        ))}                        
                        <h1 className='text-[16px] text-[#BF882E]'>SERVICES</h1>
                        {Services.map((item) => (
                            <p key={item.id} className="whitespace-nowrap">{item.name}</p>
                        ))}
                </div>
                <div className='space-y-5'>
                        <h1 className='text-[16px] text-[#BF882E]'>POLICY</h1>
                        {Policy.map((item) => (
                            <p key={item.id} className="whitespace-nowrap">{item.name}</p>
                        ))}
                        <h1 className='text-[16px] text-[#BF882E]'>ABOUT US</h1>
                        {AboutUs.map((item) => (
                            <p key={item.id} className="whitespace-nowrap">{item.name}</p>
                        ))}               
                </div>
                <div className='space-y-5'>
                    <h1 className='text-[16px] text-[#BF882E]'>OUR PROPERTIES</h1>

                    <h1 className='text-[13px] text-[#BF882E]'>HANOI CITY</h1>
                    {hotelBranches.slice(0,3).map((item, id) => (
                        <p key={id} className="whitespace-nowrap">{item.name}</p>
                    ))}                 
                    
                    <h1 className='text-[13px] text-[#BF882E]'>HO CHI MINH CITY</h1>
                    {hotelBranches.slice(3, 5).map((item, id) => (
                        <p key={id} className="whitespace-nowrap">{item.name}</p>
                    ))}       

                    <h1 className='text-[13px] text-[#BF882E]'>HOI AN CITY</h1>
                    {hotelBranches.slice(5, 6).map((item, id) => (
                        <p key={id} className="whitespace-nowrap">{item.name}</p>
                    ))}                     
                </div>
            </section>
            <section className='space-y-5'>
                <h1 className='text-[16px] text-[#BF882E]'>ACCEPTED CARDS</h1>
                <Image src="/images/visa-mastercard.png" width={110} height={110} alt='visa'/>
            </section>
            <section className='mt-4'>
                © Copyright 2023. La Siesta Premium Saigon Central. All rights reserved.
            </section>
        </div>
        <div className='lg:hidden w-full space-y-4 max-md:flex max-md:flex-col'>
            <section className='flex justify-between max-md:flex-col max-md:space-y-4'>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className='flex items-center text-white text-[18px] max-w-[82px] hover:no-underline p-0'>
                            <h1 className=' text-[#BF882E]'>HOTEL</h1>   
                        </AccordionTrigger>
                        <AccordionContent className='p-0'>
                            <div> 
                                {Hotel.map((element) => (
                                    <div 
                                        key={element.id} 
                                        className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                    >
                                        {element.name}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>   
                <Accordion type="single" collapsible>
                    <div className='flex max-md:flex-col md:grid md:grid-cols-3 md:space-x-16 md:-translate-x-[26px] space-y-4'>
                        <AccordionItem value="item-1" className='border-none'>
                            <AccordionTrigger className='flex items-center text-white text-[18px] max-w-[85px] hover:no-underline p-0'>
                                <h1 className=' text-[#BF882E]'>DINING</h1>   
                            </AccordionTrigger>
                            <AccordionContent className='p-0'>
                                <div> 
                                    {Dining.map((element) => (
                                        <div 
                                            key={element.id} 
                                            className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                        >
                                            {element.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className='border-none'>
                            <AccordionTrigger className='flex items-center text-white text-[18px] max-w-[82px] hover:no-underline p-0'>
                                <h1 className=' text-[#BF882E]'>POLICY</h1>   
                            </AccordionTrigger>
                            <AccordionContent className='p-0'>
                                <div> 
                                    {Policy.map((element) => (
                                        <div 
                                            key={element.id} 
                                            className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                        >
                                            {element.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className='border-none'>
                            <AccordionTrigger className='flex items-center text-white text-[18px] max-w-[82px] hover:no-underline p-0'>
                                <h1 className='whitespace-nowrap text-[#BF882E]'>OUR PROPERTIES</h1>   
                            </AccordionTrigger>
                            <AccordionContent className='p-0'>
                                <div> 
                                    {hotelBranches.map((element, index) => (
                                        <div 
                                            key={index} 
                                            className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                        >
                                            {element.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className='border-none'>
                            <AccordionTrigger className='flex items-center text-white text-[18px] max-w-[82px] hover:no-underline p-0'>
                                <h1 className=' text-[#BF882E]'>SERVICES</h1>   
                            </AccordionTrigger>
                            <AccordionContent className='p-0'>
                                <div> 
                                    {Services.map((element) => (
                                        <div 
                                            key={element.id} 
                                            className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                        >
                                            {element.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>                
                        <AccordionItem value="item-5">
                            <AccordionTrigger className='flex items-center text-white text-[18px] max-w-[82px] hover:no-underline p-0'>
                                <h1 className='whitespace-nowrap text-[#BF882E]'>ABOUT US</h1>   
                            </AccordionTrigger>
                            <AccordionContent className='p-0'>
                                <div> 
                                    {AboutUs.map((element) => (
                                        <div 
                                            key={element.id} 
                                            className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                        >
                                            {element.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </div>
                </Accordion>   
            </section>
            <section className='space-y-3'>
                <h1 className='text-[16px] text-[#BF882E]'>ACCEPTED CARDS</h1>
                <Image src="/images/visa-mastercard.png" width={110} height={110} alt='visa'/>
            </section>
            <section className='text-center'>
                © Copyright 2023. La Siesta Premium Saigon Central. All rights reserved.
            </section>
        </div>
    </div>
  )
}

export default NavigationLinksFooter