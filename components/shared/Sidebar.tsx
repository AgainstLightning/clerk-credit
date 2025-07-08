"use client";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements h-full">
              {navLinks.slice(0, 2).map((link) => {
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
                {navLinks.slice(2).map((link) => {
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
