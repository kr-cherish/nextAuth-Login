"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const formData = {
      fname: e.target.fname.value.trim(),
      lname: e.target.lname.value.trim(),
      age: parseInt(e.target.age.value.trim(), 10),
      gender: e.target.gender.value,
      mobileNumber: e.target.mobileNumber.value.trim(),
      email: e.target.email.value.trim(),
      password: e.target.password.value.trim(),
      confirmPassword: e.target.confirmpassword.value.trim(),
    };

    if (!formData.fname || !formData.lname) {
      setError("First name and Last name are required.");
      return;
    }

    if (isNaN(formData.age) || formData.age < 18) {
      setError("Age must be a valid number and at least 18.");
      return;
    }

    if (!["male", "female", "other"].includes(formData.gender.toLowerCase())) {
      setError("Please select a valid gender.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError("Mobile number must be 10 digits.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Email is invalid.");
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.confirmPassword !== formData.password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 400) {
        setError("The email is already in use.");
      } else if (res.status === 200) {
        setError("");
        router.push("/login");
      } else {
        setError("Registration failed, try again.");
      }
    } catch (error) {
      setError("Error, try again.");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-col items-center">
          <Image src="/logo 1.png" alt="star logo" width={50} height={50} />
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Sign up on our website
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">First Name</label>
                  <input id="fname" name="fname" type="text" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Last Name</label>
                  <input id="lname" name="lname" type="text" required className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Age</label>
                <input id="age" name="age" type="number" required className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Gender</label>
                <select id="gender" name="gender" required className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Mobile Number</label>
                <input id="mobileNumber" name="mobileNumber" type="text" required className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Email address</label>
                <input id="email" name="email" type="email" required className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <input id="password" name="password" type="password" required className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
                <input id="confirmpassword" name="confirmpassword" type="password" required className="input-field" />
              </div>

              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="mr-2" />
                <label htmlFor="terms" className="text-sm text-gray-900">
                  Accept our terms and privacy policy
                </label>
              </div>

              <div>
                <button type="submit" className="btn-primary">Sign up</button>
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default RegisterPage;
