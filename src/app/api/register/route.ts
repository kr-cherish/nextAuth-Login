import User from "@/model/User";
import connect from "@/app/utils/dbConnection";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();

    await connect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(" Registration error:", err.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
