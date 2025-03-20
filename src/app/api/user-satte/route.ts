import User from "@/model/User";
import connect from "@/app/utils/dbConnection";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const totalUsers = await User.countDocuments();
    const maleCount = await User.countDocuments({ gender: "male" });
    const femaleCount = await User.countDocuments({ gender: "female" });

    return NextResponse.json(
      { maleCount, femaleCount },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching user stats:", err.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
};
