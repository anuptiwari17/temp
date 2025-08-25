"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import supabase from "@/services/supabase";
import { UserDetailContext } from "./context/UserDetailContext";

function Providers({ children }) {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    if (isLoaded && user && !userDetail && !isCreatingUser) {
      CreateNewUser();
    }
  }, [user, isLoaded, userDetail, isCreatingUser]);

  const CreateNewUser = async () => {
    console.log("=== CREATE NEW USER DEBUG ===");
    console.log("User from Clerk:", user);
    console.log("Is user loaded:", isLoaded);
    
    if (isCreatingUser) {
      console.log("Already creating user, skipping...");
      return;
    }

    setIsCreatingUser(true);

    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const name = user?.fullName;
      
      console.log("Extracted email:", email);
      console.log("Extracted name:", name);

      if (!email) {
        console.warn("No email found for user.");
        return;
      }

      console.log("Checking if user exists in Users table...");
      const { data: Users, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email);

      console.log("Existing users check - data:", Users);
      console.log("Existing users check - error:", fetchError);

      if (fetchError) {
        console.error("Error checking existing user:", fetchError);
        return;
      }

      if (Users.length === 0) {
        console.log("User does not exist, inserting new user...");
        const { data: insertedData, error: insertError } = await supabase
          .from("Users")
          .insert([{ name, email }])
          .select();

        console.log("Insert user - data:", insertedData);
        console.log("Insert user - error:", insertError);

        if (insertError) {
          console.error("Error inserting new user:", insertError);
          return;
        }

        console.log("✅ New user created successfully:", insertedData[0]);
        setUserDetail(insertedData[0]);
      } else {
        console.log("✅ User already exists, using existing data:", Users[0]);
        setUserDetail(Users[0]);
      }
    } catch (error) {
      console.error("❌ Error in CreateNewUser:", error);
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div className="w-full">{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Providers;