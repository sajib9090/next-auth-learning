"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  console.log(session);
  const pathname = usePathname();

  return (
    <div className="h-[60px] bg-slate-300 flex items-center justify-between">
      <div>Logo</div>
      <div className="flex items-center space-x-6">
        <Link
          className={`hover:text-blue-600 ${
            pathname === "/" ? "text-blue-600" : ""
          }`}
          href={"/"}
        >
          Home
        </Link>
        <Link
          className={`hover:text-blue-600 ${
            pathname === "/dashboard" ? "text-blue-600" : ""
          }`}
          href={"/dashboard"}
        >
          Dashboard
        </Link>

        {status === "authenticated" ? (
          <>
            <button className="text-yellow-600">{session?.user?.email}</button>

            <button className="text-red-600">{session?.user?.role}</button>

            <button className="text-green-600">
              {session?.user?.provider}
            </button>

            <button>Logout</button>
          </>
        ) : (
          <>
            <Link
              className={`hover:text-blue-600 ${
                pathname === "/login" ? "text-blue-600" : ""
              }`}
              href={"/login"}
            >
              Login
            </Link>
            <Link
              className={`hover:text-blue-600 ${
                pathname === "/register" ? "text-blue-600" : ""
              }`}
              href={"/register"}
            >
              Register
            </Link>
          </>
        )}
      </div>
      <div>Right</div>
    </div>
  );
};

export default Navbar;
