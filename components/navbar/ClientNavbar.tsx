"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MobileNavigation from "./MobileNavigation";
import { navLinks } from "@/constants/navLinks";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useSession, signOut } from "next-auth/react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import ROUTES from "@/constants/route";

const ClientNavbar = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh(); // Cập nhật lại UI sau khi đăng xuất
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`playfair fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md text-black" : "bg-transparent text-white"
      }`}
    >
      <div className="flex justify-center mx-40">
        <div className="container mx-auto flex items-center justify-between py-5">
          <section className="flex text-2xl">
            <Link href={ROUTES.HOME} className="font-bold  transition-colors duration-300">La Roche</Link>
          </section>

          <section className="max-2xl:hidden">
            <nav className="flex gap-18 mr-4 text-md">
              {navLinks.map((item, index) => (
                <Link key={index} href={item.route} className="whitespace-nowrap transition-colors duration-300">
                  {item.label}
                </Link>
              ))}
            </nav>
          </section>

          <section className="flex items-center gap-4">
            {userId ? (
              <Menubar className="bg-transparent border-none">
                <MenubarMenu>
                  <MenubarTrigger className="border-none !bg-transparent">
                    <Avatar className="w-[46px] h-[46px] flex justify-end">
                      <AvatarImage src="https://i.pinimg.com/736x/ec/b2/f8/ecb2f885b51eeb0204b6f2be4c19b8cf.jpg" />
                    </Avatar>
                  </MenubarTrigger>

                  <MenubarContent align="center" style={{ width: "100px", minWidth: "unset" }} className="playfair hover:bg-gray-200 flex justify-center text-md">
                    <MenubarItem className="flex whitespace-nowrap gap-3 hover:bg-transparent" onClick={handleSignOut}>
                      Log Out
                      <LogOut />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            ) : (
              <div className="space-x-3">
                <Button className="bg-[#081746] rounded-sm hover:bg-[#0f225e]">
                  <Link href={ROUTES.SIGN_IN} className="playfair text-md">
                    Sign In
                  </Link>
                </Button>

                <Button className="bg-[#081746] rounded-sm hover:bg-[#0f225e]">
                  <Link href={ROUTES.SIGN_UP} className="playfair text-md">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            <div className="2xl:hidden flex items-center">
              <MobileNavigation />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClientNavbar;
