"use client";

import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import { PiSignInBold } from "react-icons/pi";
import { BsPersonFillAdd } from "react-icons/bs";
import MenuList from "../MenuList/menuList";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import the hooks
import Notification from '../Notification/Notification';

const menuIcon = (
  <div>
    <IoMenu className="h-8 w-8 text-[#035fe9]" />
  </div>
);
const signedInIcon = (
  <div>
    <FaUserCircle className="h-10 w-10 text-[#035fe9]" />
  </div>
);

const Navbar = () => {
  const [token, setToken] = useState<any>();
  const [userRole, setUserRole] = useState<any>();
  const router = useRouter();

  const checkAuth = () => {
    const expiryDate = localStorage.getItem("expiryDate");
    if (
      expiryDate &&
      Math.floor(new Date().getTime() / 1000) > Number(expiryDate)
    ) {
      localStorage.clear();
    }
    setToken(localStorage.getItem("jwt"));
    setUserRole(localStorage.getItem("userRole"));
  };
  
  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  return (
    <nav className="h-14 bg-white border border-b-[1px] sticky top-0 z-10 pb-8">
      <div className="max-w-full md:max-w-[90%] min-[1130px]:max-w-[75%] flex justify-between items-center mx-auto">
        <Link href="/">
          <div className="flex justify-center items-center">
            <img className="w-14 h-14" src="/assets/logo.png" alt="logo" />
            <span className="texl-base md:text-xl">TeleMedPilot</span>
          </div>
        </Link>
        <div className="hidden min-[1130px]:inline-block justify-between space-x-4 text-[#4d4d4f] text-sm font-light">
          <button
            className="font-semibold hover:text-[#035fe9]"
            onClick={() => router.push("/doctors")}
          >
            Doctor List
          </button>
          <button
            disabled
            className="font-semibold hover:disable hover:opacity-50"
          >
            Tests
          </button>
          <button
            className="font-semibold hover:text-[#035fe9]"
            onClick={() => router.push("/doctors")}
          >
            Find A Doctor
          </button>
          <button
            disabled
            className="font-semibold hover:disable hover:opacity-50"
          >
            Blog
          </button>
        </div>
        <div className="flex justify-between items-center space-x-0 md:space-x-4 min-[1130px]:space-x-6">
          <a className="cursor-pointer font-medium">العربيه</a>
          {!token ? (
            <>
              <Link href="/auth/signin">
                <button className="hidden min-[1130px]:inline-block border border-[#035fe9] rounded-lg text-[#035fe9] px-12 py-2 my-2">
                  Sign in
                </button>
                <button className="min-[1130px]:hidden text-[#035fe9] p-2 my-2">
                  <PiSignInBold className="h-6 w-6 text-[#035fe9]" />
                </button>
              </Link>
              <Link href="/auth/signup">
                <button
                  className={
                    styles.gradient_button +
                    " hidden min-[1130px]:inline-block px-12 py-2 my-2 text-white rounded-lg "
                  }
                >
                  Sign up
                </button>
                <button className="min-[1130px]:hidden p-2 my-2 text-[#035fe9] rounded-lg">
                  <BsPersonFillAdd className="h-6 w-6 text-[#035fe9]" />
                </button>
              </Link>
            </>
          ) : (
            <div>
              <MenuList
                linkTo={
                  userRole === "Patient" || token.userRole === "Patient"
                    ? [
                      "/patientProfile",
                      "/patientProfile/upcoming_appointments",
                      "/patientProfile/patientDocuments",
                      "/patientProfile/paymentInfo",
                      "signout",
                    ]
                    : [
                      "/doctorProfile",
                      "/doctorProfile/timeSlots",
                      "/doctorProfile/appointments",
                      "signout",
                    ]
                }
                linkName={
                  userRole === "Patient" || token.userRole === "Patient"
                    ? [
                      "View Profile",
                      "My Appointments",
                      "My Documents",
                      "Wallet",
                      "Sign Out",
                    ]
                    : [
                      "View Profile",
                      "Set Time Slots",
                      "My Appointments",
                      "Sign Out",
                    ]
                }
                text={signedInIcon}
                onSignOut={() => {
                  localStorage.clear();
                  window.dispatchEvent(new Event('auth-change'));
                  router.push('/');
                }}
              />
            </div>
          )}

          {token && <Notification />}

          <div className="min-[1130px]:hidden">
            <MenuList
              linkTo={["/doctors", "", "", ""]}
              linkName={["Doctor List", "Tests", "Find a Doctor", "Blog"]}
              text={menuIcon}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
