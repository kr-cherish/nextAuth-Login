"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";

const Navbar = () => {
  const { data: session }: { data: Session | null } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="text-2xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            {/* <Image src="/public/logo 1.png" width={50} height={50} alt="star logo" /> */}
          </Link>
        </div>
        <div className="hidden lg:flex ml-100 lg:gap-x-12">
          {navigation.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className="text-sms font-semibold leading-6 text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6 ">
          {!session ? (
            <>
              <Link
                href="/login"
                className="hidden lg:block lg:text-sm lg:font-semibold bg-black text-white rounded-md px-5 py-2"

              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-black px-3 py-2 border-gray-500 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              {session.user?.email && <span className="ml-10 text-sm">{session.user.email}</span>}
              <button
                onClick={() => signOut()}
                className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
              >
                Log out
              </button>
            </>
          )}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
