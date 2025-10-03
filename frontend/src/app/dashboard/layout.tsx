"use client";
import React from "react";
import { ReactNode } from "react";
import { useUser } from "@/contexts/UserContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { CiCreditCard2 } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import { BsPersonFill } from "react-icons/bs";
import { FaGift } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";

interface DashboardLayoutProps {
  children: ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  //   const { accessToken, user } = useUser();
  //   if (!user && !accessToken) {
  //     redirect("/login");
  //   }
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navs = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: <GrTransaction />,
    },
    {
      name: "Send Money",
      href: "/dashboard/send-money",
      icon: <CiCreditCard2 />,
    },
    {
      name: "Lucky Draw",
      href: "/dashboard/lucky-draw",
      icon: <FaGift />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <BsPersonFill />,
    },
  ];

  return (
    <div className="flex h-screen text-black ">
      <aside
        className="hidden md:block md:basis-[15%] bg-white shadow-[2px_0_4px_0_rgba(0,0,0,0.1)] relative z-10
"
      >
        <div>
          <div className="w-24 mb-6 m-6">
            <Image
              src={"/swift-logo.png"}
              alt="logo"
              width={40}
              height={40}
              className="w-full"
            />
          </div>
          <ul>
            {navs.map((nav) => (
              <li className="" key={nav.href}>
                <Link
                  href={nav.href}
                  className={`flex px-6 py-3 items-center gap-2 cursor-pointer ${
                    pathname === nav.href
                      ? "bg-gray-200 text-black"
                      : "text-gray-500"
                  } hover:opacity-100`}
                >
                  {nav.icon}
                  <span>{nav.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute w-full bottom-6 left-0">
          <Link
            href={"/dashboard/settings"}
            className={`flex px-6 py-3 items-center gap-2 cursor-pointer ${
              pathname === "/dashboard/settings"
                ? "bg-gray-200 text-black"
                : "text-gray-500"
            } hover:opacity-100`}
          >
            <IoMdSettings />
            Settings
          </Link>

          <button className="flex items-center gap-2 px-6 py-3 cursor-pointer">
            <RiLogoutBoxRLine />
            Log out
          </button>
        </div>
      </aside>

      <main className="basis-[100%] md:basis-[85%] bg-white p-6 text-black">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden mb-4 flex absolute left-3 top-7 "
        >
          {isOpen ? <RxCross1 /> : <GiHamburgerMenu />}
        </button>
        {isOpen && (
          <div className="fixed top-0 left-0 w-2/4 h-full bg-white shadow-lg z-50 md:hidden">
            <div className="flex justify-between items-center p-4 ">
              <Image
                src={"/swift-logo.png"}
                alt="logo"
                width={40}
                height={40}
                className="w-20"
              />
              <button onClick={() => setIsOpen(false)}>
                <RxCross1 />
              </button>
            </div>

            <ul className="">
              {navs.map((nav) => (
                <li key={nav.href}>
                  <Link
                    href={nav.href}
                    className={`flex px-6 py-3 items-center gap-2 cursor-pointer ${
                      pathname === nav.href
                        ? "bg-gray-200 text-black"
                        : "text-gray-600"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {nav.icon}
                    {nav.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="absolute bottom-6 left-0 w-full px-4">
              <Link
                href={"/dashboard/settings"}
                className={`flex px-3 py-3 items-center gap-2 cursor-pointer ${
                  pathname === "/dashboard/settings"
                    ? "bg-gray-200 text-black"
                    : "text-gray-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <IoMdSettings />
                Settings
              </Link>

              <button className="flex items-center gap-2 px-3 py-3 cursor-pointer">
                <RiLogoutBoxRLine />
                Log out
              </button>
            </div>
          </div>
        )}
        <div className="px-6">{children}</div>
      </main>
    </div>
  );
}
