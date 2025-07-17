"use client";

import { navLinks } from "@/constants";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const Sidebar = ({ creditBalance }: { creditBalance: number }) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements h-full">
              {navLinks.slice(0, 3).map((link) => {
                const isActive = pathname === link.route;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link href={link.route}>{link.label}</Link>
                  </li>
                );
              })}

              <ul className="sidebar-nav_elements mt-auto">
                <li>
                  <div className="flex items-center gap-2">
                    <div className="mt-4 flex items-center gap-4">
                      <Image
                        src="/assets/icons/coins.svg"
                        alt="coins"
                        width={32}
                        height={32}
                      />
                      <h2 className="font-bold text-dark-600">
                        {creditBalance}
                      </h2>
                    </div>
                  </div>
                </li>
                <li className="flex-center cursor-pointer gap-2 text-nowrap overflow-hidden">
                  <OrganizationSwitcher />
                </li>
                <li className="flex-center cursor-pointer gap-2 text-nowrap overflow-hidden">
                  <UserButton afterSignOutUrl="/" showName />
                </li>
              </ul>
            </ul>
          </SignedIn>
          <SignedOut>
            <Button
              asChild
              className="button bg-purple-gradient bg-cover text-nowrap"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
