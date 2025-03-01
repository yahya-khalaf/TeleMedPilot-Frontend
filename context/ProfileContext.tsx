"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  languages: string;
  rating: string;
}

interface ProfileContextType {
  profileData: ProfileData | null;
  loading: boolean;
  setLoading(value: boolean): void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    console.log("token", token)
    if (!token) {
      if (
        pathname !== "/auth/signin" &&
        pathname !== "/auth/signup" &&
        pathname !== "/doctors" &&
        pathname !== "/"
      ) {
        router.push("/auth/signin");
      }
    } else if (
      Math.floor(new Date().getTime() / 1000) >
      Number(localStorage.getItem("expiryDate"))
    ) {
      localStorage.clear();
      router.push("/auth/signin");
    } else if (pathname.includes("patientProfile")) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/profile/info`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log("response", response.json())
            throw new Error("Failed to fetch profile data");
          }
          return response.json();
        })
        .then((response) => {
          setProfileData(response.formattedPatient);
          console.log("profileData", profileData);
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        })
        .finally(() => setLoading(false));
    } else if (pathname.includes("doctorProfile")) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/doctor/profile/info`, {
        mode: "cors",
        headers: {
          Authorization: "Bearer " + token,
        },

      })

        .then((response) => {
          if (!response.ok) {
            console.log("response", response.json())
            localStorage.clear();
            router.push("/auth/signin");
          }
          const data = response.json();
          console.log("data", data);
          return data;
        })
        .then((response) => setProfileData(() => response.formattedDoctor))
        .finally(() => setLoading(false));
    }
  }, [pathname, router]);

  return (
    <ProfileContext.Provider value={{ profileData, loading, setLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};
