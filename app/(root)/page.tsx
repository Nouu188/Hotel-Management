"use client";

import ImagesCarousel from '@/components/ImagesAutoCarousel'
import { CircleUserRound, Gem, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import React, { useState } from 'react'
import DynamicReactPlayer from '@/components/DynamicReactPlayer';
import FloatingChatButton from '@/components/QuickActionBar';
import QuickActionBar from '@/components/QuickActionBar';
import ClientNavbar from '@/components/navbar/navbar_for_homepage/ClientNavbarForHomePage';
import RoomsCheck from '@/components/selector/RoomsCheck';

const HomePage = () => {
  return (
    <div>
      <ClientNavbar/>
      <div className='flex flex-col min-w-screen w-full'>
          <ImagesCarousel />
          
          <section className='-mt-24 z-100'>
            <div className='max-lg:hidden'>
              <RoomsCheck />
              <FloatingChatButton />
            </div>
            <QuickActionBar />
          </section>

          <section className='flex flex-col max-lg:mt-20 justify-center  lg:mt-2 pb-4'>
            <div className='flex flex-col justify-center items-center max-lg:mt-6 py-4 playfair text-[#081746] text-[26px] md:text-[38px]'>
              <h1>Welcome to</h1>
              <div className='-space-y-3'> 
                <p></p>
                <p>La Sieste Premium Saigon</p>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='w-full max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 space-y-4 flex flex-col text-[#4e5054]'>
                <div className='text-center'>Discover the epitome of luxury and hospitality at La Siesta Premium Saigon Hotel, where a one-of-a-kind experience awaits you in District 1, Ho Chi Minh City. Immerse yourself in the vibrant surroundings of bustling restaurants and entertainment venues, while being only a stone’s throw away from the city’s iconic landmarks and attractions. The hotel’s strategic location also means that Tan Son Nhat International Airport is just a mere 20 minutes away and the central bus station is just steps away.</div>
                <div className='text-center'>Boasting 91 luxurious guest rooms and suites, La Siesta Premium Saigon Hotel is an exceptional retreat for both leisure and business travelers. Our world-class facilities include versatile event venues, a casual all-day dining restaurant, a refined Vietnamese restaurant, and a lively Sky Bar & lounge for late-night revelry. Our team of dedicated professionals is committed to providing exceptional service that comes straight from the heart.</div>
                <div className='text-center'>At Elegance Hospitality Group, we take pride in delivering unforgettable experiences that have established us as one of Vietnam’s most highly esteemed boutique hotel groups. Our impeccable reputation quality and a five-star ethos is unparalleled, and we invite you to experience our unrivaled service firsthand.</div>
              </div>    
            </div>
          </section>

          <section className='py-8 lg:py-16 flex justify-center'>
              <div className='w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4'>
                  <div className='aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black'> 
                      <DynamicReactPlayer 
                          width='100%'     
                          height='100%' 
                          controls={true}
                          url='https://www.youtube.com/watch?v=2Om2HXPk9Q4&t=11s'
                          light={
                              <div className='relative w-full h-full group cursor-pointer'> 
                                  <Image
                                      src="/images/1.jpg"
                                      alt="Thumbnail video giới thiệu khách sạn La Siesta Premium Saigon"
                                      fill 
                                      style={{ objectFit: 'cover' }} 
                                      className='transform group-hover:scale-105 transition-transform duration-300 ease-in-out'
                                      placeholder="blur"
                                      blurDataURL="/images/1.jpg" 
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px" 
                                  />
                              </div>
                          }
                      />
                  </div>
              </div>
          </section>

          <section className='flex justify-center py-6'>
            <div className='flex max-lg:flex-col max-lg:space-y-4 items-center justify-between lg:space-x-16'>
              <div className='flex justify-between items-center gap-2 lg:gap-10 xl:gap-14 py-3 md:py-5 text-[15px] border-t-1 border-b-1'>
                  <div className='flex gap-3 max-md:max-w-[115px]'>
                    <MapPin className=''/>  
                    City center location
                  </div>
                  <div className='flex gap-3 max-md:max-w-[140px]'>
                    <Gem className=''/>
                    New dimension of luxury
                  </div>
                  <div className='flex gap-3 max-md:max-w-[115px]'>
                    <CircleUserRound/>
                    Personalized Service
                  </div>
              </div>

              <div className='flex flex-col justify-center text-center'>
                <Link className='hover:text-[#BF882E] transition-colors duration-300 cursor-pointer' href="https://www.tripadvisor.com/Hotel_Review-g293925-d25442757-Reviews-La_Siesta_Premium_Saigon-Ho_Chi_Minh_City.html">TripAdvisor Traveler Rating</Link>
                <Image src="/images/tripAdvisor.png" width={310} height={310} alt='trip-advisor' />
                <p>Based on 1,934 traveler reviews</p>
                <p>Read review</p>
              </div>
            </div>
          </section>
      </div>
    </div>
  )
}

export default HomePage