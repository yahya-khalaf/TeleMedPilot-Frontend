"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Doctor {
  title: string;
  country: string;
  language: string[];
  fees60min: number;
  nearestApp: string;
  rating: number;
  gender: string;
  isOnline: boolean;
}

interface DoctorContextProps {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
  fetchDoctors: () => void;
}

const DoctorContext = createContext<DoctorContextProps | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}/patient/home`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      setDoctors(data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (doctors.length === 0) {
      fetchDoctors();
    }
  }, [doctors]);

  return (
    <DoctorContext.Provider value={{ doctors, isLoading, error, fetchDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctorContext must be used within a DoctorProvider");
  }
  return context;
};
