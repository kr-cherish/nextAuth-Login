"use client";

import { useEffect, useState } from "react";
export default function Home() {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    maleCount: 0,
    femaleCount: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch("/api/user-stats");
        if (!res.ok) throw new Error("Failed to fetch user stats");

        const data = await res.json();
        setUserStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, []);
  return (
    <div className="flex gap-2 p-4 h-full">
      <div className="flex flex-col gap-2 h-full w-[50%]">
        <div className="flex flex-row gap-2 w-full h-[50%]  ">
          <div className="bg-gradient-to-r from-gray-700 via-neutral-600 to-neutral-700 text-black  rounded-4xl w-[32%] m-4 p-4"> <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{userStats.totalUsers}</p></div>
          <div className="bg-gradient-to-r from-gray-700 via-neutral-600 to-neutral-700 text-black  rounded-4xl w-[32%] m-4 p-4"><h2 className="text-xl font-semibold">Male Users</h2>
          <p className="text-3xl font-bold">{userStats.maleCount}</p></div>
          <div className="bg-gradient-to-r from-gray-700 via-neutral-600 to-neutral-700 text-black  rounded-4xl w-[32%] m-4 p-4"> <h2 className="text-xl font-semibold">Female Users</h2>
          <p className="text-3xl font-bold">{userStats.femaleCount}</p></div>
        </div>
        <div className="bg-gradient-to-r from-gray-700 via-neutral-600 to-neutral-700 rounded-4xl  m-4 w-[96%] h-[50%]">

        </div>
      </div>
      <div className="bg-gradient-to-r from-gray-700 via-neutral-600 to-neutral-700 w-[50%] rounded-4xl m-4">
        
      </div>
    </div>
  );
}
