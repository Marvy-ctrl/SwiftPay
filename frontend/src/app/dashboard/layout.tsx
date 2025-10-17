"use client";
import React from "react";
import { ReactNode } from "react";
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
import LogoutDialog from "@/components/logout-dialog";
import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: user, isLoading, isError, error, refetch } = useUser();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  const { mutate: logout } = useLogout();
  const handleClose = () => setOpen(false);

  const handleOk = () => {
    try {
      logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-black">Loading...</p>
        </div>
      </div>
    );

  if (!user) {
    redirect("/");
  }

  if (!user.is_verified) {
    redirect("/");
  }

  const navs = [
    {
      name: "Home",
      href: "",
      icon: <FaHome />,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: <GrTransaction />,
    },
    {
      name: "Send Money",
      href: "/send-money",
      icon: <CiCreditCard2 />,
    },
    {
      name: "Lucky Draw",
      href: "/lucky-draw",
      icon: <FaGift />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <BsPersonFill />,
    },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-black">Loading...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <>
        <p className="text-red-500">Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-cyan-900 text-white rounded-md"
        >
          Refresh User
        </button>
      </>
    );

  return (
    <>
      <LogoutDialog
        title="Log Out"
        onClose={handleClose}
        onOk={handleOk}
        open={open}
      >
        <div className="space-y-2">
          <h1>Are you sure you want to log out?</h1>
        </div>
      </LogoutDialog>
      <div className="flex min-h-screen text-black ">
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
              {navs.map((nav) => {
                const fullPath = `/dashboard${nav.href}`;

                const isActive =
                  nav.href === ""
                    ? pathname === "/dashboard"
                    : pathname.startsWith(fullPath);

                return (
                  <li key={nav.href}>
                    <Link
                      href={fullPath}
                      className={`flex px-6 py-3 items-center gap-2 cursor-pointer ${
                        isActive ? "bg-gray-200 text-black" : "text-gray-500"
                      } hover:opacity-100`}
                    >
                      {nav.icon}
                      <span>{nav.name}</span>
                    </Link>
                  </li>
                );
              })}
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
            <button
              // type="submit"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-6 py-3 cursor-pointer"
            >
              <RiLogoutBoxRLine />
              Log out
            </button>
          </div>
        </aside>
        {/* mobile screen */}
        <main className="basis-[100%] md:basis-[85%] bg-white p-4 md:p-6 text-black">
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
                {navs.map((nav) => {
                  const fullPath = `/dashboard${nav.href}`;

                  const isActive =
                    nav.href === ""
                      ? pathname === "/dashboard"
                      : pathname.startsWith(fullPath);

                  return (
                    <li key={nav.href}>
                      <Link
                        href={fullPath}
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
                  );
                })}
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

                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 px-3 py-3 cursor-pointer"
                >
                  <RiLogoutBoxRLine />
                  Log out
                </button>
              </div>
            </div>
          )}
          <div className="h-full ">{children}</div>
        </main>
      </div>
    </>
  );
}
