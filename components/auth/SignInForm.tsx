"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InputComponent from "./InputComponent";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useToast } from '@/context/ToastContext';
import sendEmail from "@/utils/sendEmail"

function SignInForm() {
  const router = useRouter();
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isBanned, setIsBanned] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    validateForm();
  }, [formData]);

  const ACCESS_TOKEN_SECRET_KEY = `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET_KEY}`;

  const tokenAuthentication = (req: any) => {
    const token = req.token;

    let message = "";
    if (token) {
      jwt.verify(
        token,
        ACCESS_TOKEN_SECRET_KEY,
        (err: any, decodedToken: any) => {
          if (err) {
            message = "Invalid token";
            console.log(message);
            return false;
          }
          console.log(decodedToken);
          req.id = decodedToken.id;
          req.email = decodedToken.email;
          req.userRole = decodedToken.role;
          req.firstName = decodedToken.firstName;
          req.lastName = decodedToken.lastName;
          req.tokenExpiryDate = decodedToken.exp;

          return true;
        }
      );
    } else {
      message = "No token found";
      console.log(message);
      return false;
    }
    return true;
  };

  const submitButtonClass = [
    "bg-sky-500 text-neutral-50 text-lg	p-3.5	w-full border-none rounded-lg cursor-pointer transition-[background-color]",
    "disabled:bg-neutral-300 disabled:text-neutral-700 disabled:cursor-not-allowed enabled:bg-sky-500",
  ].join(" ");

  const validateForm = () => {
    const { email, password } = formData;
    if (email && password) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!formValid) {
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_NAME}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        setLoading(false);
        setSignedIn(false);
        
        if (response.status === 400) {
          setError(true);
          setIsBanned(false);
          showError('Incorrect Email or Password!');
        } else if (response.status === 403) {
          setError(false);
          setIsBanned(true);
          showError('Your account has been banned. Please contact support.');
        }
        throw new Error("Failed To Sign In");
      }

      const users = await response.json();
      console.log("responseee",users); 

      if (tokenAuthentication(users)) {
        localStorage.setItem("jwt", users.token);
        localStorage.setItem("expiryDate", users.tokenExpiryDate);
        localStorage.setItem("userRole", users.userRole);
        localStorage.setItem("userId", users.id);
        localStorage.setItem("firstName", users.firstName);
        localStorage.setItem("lastName", users.lastName);
        
        // Dispatch custom event
        window.dispatchEvent(new Event('auth-change'));
        
        showSuccess('Logged-in Successfully');
        setLoading(false);
        setError(false);
        setSignedIn(true);
        router.replace("/");
      } else {
        showError('Error During Token Authentication');
      }
    } catch (error: any) {
      setLoading(false);
      if (!error.message.includes("Failed To Sign In")) {
        showError('Error During Sign In');
      }
      console.error("Error During Sign In:", error);
    }
  };

  return (
    <div className="p-5 rounded-xl max-w-md m-auto max-h-screen">
      <h2 className="font-bold text-2xl text-center text-neutral-700 mb-6">
        Sign in
      </h2>
      <form onSubmit={handleSubmit}>
        <InputComponent
          label="Email"
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputComponent
          label="Password"
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <p className="mb-2">
          Don&apos;t Have An Account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-500 font-semibold cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          className={submitButtonClass}
          disabled={!formValid || loading}
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        {error && (
          <p className="font-semibold text-red-700 mt-4">
            Incorrect Email or Password!
          </p>
        )}
        {isBanned && (
          <p className="font-semibold text-red-700 mt-4">
            Your account has been banned. Please contact support.
          </p>
        )}
        {signedIn && (
          <p className="font-semibold text-green-700 mt-4">
            Signed in successfully!
          </p>
        )}
      </form>
    </div>
  );
}

export default SignInForm;
