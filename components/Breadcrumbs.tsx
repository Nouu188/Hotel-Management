"use client";

import { usePathname } from 'next/navigation'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link';
import { generateLabel } from '@/lib/utils';

interface BreadcrumbsItem {
    label: string,
    href: string,
    isCurrent: boolean,
}

export default function Breadcrumbs () {
    const pathname = usePathname();

    const pathSegments = pathname.split("/").filter(pathname => pathname);

    const breadCrumbs: BreadcrumbsItem[] = [
        { label: "Home", href: "/", isCurrent: pathname === "/"},
    ];

    let currentHrefAccumulator = '';
    pathSegments.forEach((segment, index) => {
        currentHrefAccumulator += `/${segment}`;
        const isLastSegment = index === pathSegments.length - 1; // Kiểm tra xem có phải segment cuối không

        breadCrumbs.push({
            label: generateLabel(segment), 
            href: currentHrefAccumulator, 
            isCurrent: isLastSegment,     
        });
    })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbs.map((item) => (
            <div className='flex items-center' key={item.href}>
                <BreadcrumbItem  className='raleway mr-2'>
                    {item.isCurrent ? (
                        <BreadcrumbPage>
                            {item.label}
                        </BreadcrumbPage>
                    ) : (
                        <>
                            <BreadcrumbLink asChild className='hover:text-[#BF882E] transition-colors duration-300 cursor-pointer'>
                                <Link href={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                        </>
                    )}
                </BreadcrumbItem>
                {!item.isCurrent && ( <BreadcrumbSeparator /> )}
            </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
