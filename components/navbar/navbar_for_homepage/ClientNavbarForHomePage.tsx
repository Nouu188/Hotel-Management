"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ROUTES from "@/constants/route";
import Image from "next/image";
import RightClientNavbar from "./RightClientNavbar";
import LeftClientNavbar from "./LeftClientNavbar";

const ClientNavbar = () => {
  const hotelName = "LASIESTA";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-200 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white shadow-md pb-12 text-black" : "bg-transparent text-white"
      }`}
    >
      <div className={`flex text-[12px] ${isScrolled && "translate-y-7"}`}>  
        
        <div className="raleway container mx-auto flex items-center lg:justify-center justify-between max-xl:gap-4 gap-12">
          <LeftClientNavbar/>

          {isScrolled ? (
            <Link href={ROUTES.HOME} className="text-center text-[23px] transition-all duration-300 -translate-y-1 ease-in-out">
              <p className="playfair whitespace-nowrap translate-y-1">{hotelName.split('').join(" ")}</p>
              <p className="text-[11px]">Luxury Bontique Hotel <br/>Premium</p>
            </Link>
          ) : (
            <div>
              <Link href={ROUTES.HOME} className="flex items-start top-0 z-100 w-[164px] h-[130px] max-sm:w-[130px] max-sm:h-[100px] max-2xl:w-[140px] max-2xl:h-[118px] relative transition-all duration-300 ease-in-out">
                <Image src="/images/10.svg" fill alt="hotel"/>
              </Link>           
            </div>
          )}

          <RightClientNavbar/>
        </div>
      </div>
    </div>
  );
};

export default ClientNavbar;
