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

interface BreadcrumbsItem {
    label: string,
    href: string,
    isCurrent: boolean,
}

export const generateLabel = (segment: string): string => {
  if (!segment) return "Home"; 

  let label = segment.replace(/-/g, ' ').replace(/_/g, ' ');

  label = label
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(' '); 

  return label;
};

export const generateSegmentFromLabel = (label: string): string => {
  if (label.trim().toLowerCase() === "home") {
    return "";
  }

  let segment = label.toLowerCase();

  segment = segment.replace(/\s+/g, '-');
  segment = segment.replace(/[^a-z0-9-]/g, '');
  segment = segment.replace(/^-+|-+$/g, '');

  return segment;
};

export function removeLastSegment(pathname: string): string {
  if (!pathname) {
    return "/"; 
  }

  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (normalizedPath === "/" || normalizedPath === "") {
    return "/";
  }

  const lastSlashIndex = normalizedPath.lastIndexOf('/');

  if (lastSlashIndex <= 0) { 
    return "/";
  }

  return normalizedPath.substring(0, lastSlashIndex);
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
