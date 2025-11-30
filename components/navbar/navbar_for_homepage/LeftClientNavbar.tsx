"use client";

import { navLinks } from '@/constants/navLinks'
import Link from 'next/link'
import React from 'react'
import MobileNavigation from '../MobileNavigation';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { NavigationMenuTrigger } from '@radix-ui/react-navigation-menu';
import { generateLabel } from '@/lib/utils';

const LeftClientNavbar = () => {
  return (
    <div>
        <div className="lg:hidden max-lg:translate-x-6">
            <MobileNavigation />
        </div>
        <section className="max-lg:hidden container">
            <nav className="mt-5">
                <NavigationMenu viewport={false}>
                    <NavigationMenuList className='gap-10 max-xl:gap-8'>
                        {navLinks.slice(0, 4).map((item, index) => (
                            <NavigationMenuItem key={index}>
                                <NavigationMenuTrigger className="whitespace-nowrap hover:text-[#BF882E] hover:bg-transparent transition-colors duration-200">
                                    <Link href={item.route}> {item.label}</Link>
                                </NavigationMenuTrigger>
                                {item.items && (
                                    <NavigationMenuContent className='text-[13px] z-110 space-y-2 p-3 lg:max-w-84 w-full text-black'>
                                        {item.items?.map((element, index) => (
                                            <div className='' key={index} >
                                                <Link className='whitespace-nowrap hover:text-[#BF882E] hover:bg-transparent transition-colors duration-200' href={`${item.route}/${element.name}`}>
                                                    {generateLabel(element.name)}
                                                </Link>
                                            </div>
                                        ))}
                                    </NavigationMenuContent>
                                )}
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
        </section>        
    </div>

  )
}

export default LeftClientNavbar

function ListItem({
  title,
  children,
  href,
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <div>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </div>
  )
}
