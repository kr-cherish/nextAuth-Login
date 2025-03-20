import User from "@/model/User";
import connect from "@/app/utils/dbConnection";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { fname, lname, age, gender, mobileNumber, email, password } = await request.json();

    await connect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!fname || !lname || !email || !password || !age || !gender || !mobileNumber) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (isNaN(age) || age < 18) {
      return NextResponse.json(
        { message: "Age must be a number and at least 18" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return NextResponse.json(
        { message: "Mobile number must be 10 digits" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      fname,
      lname,
      age,
      gender,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Registration error:", err.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
