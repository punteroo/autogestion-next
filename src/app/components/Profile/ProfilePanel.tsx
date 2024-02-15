"use client";

import ProfileCard from "./ProfileCard";
import { ProfileActions } from "./ProfileActions";
import { ProfileOverService } from "./ProfileOverService";
import { useSession } from "next-auth/react";
import { isStudentOnOverService } from "@/lib/subscription.utils";
import { useEffect } from "react";

export default function ProfilePanel() {
  const { data: session } = useSession();

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Mi Cuenta
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">Mi Cuenta</h1>
        <ProfileCard />
        <ProfileActions />
        {isStudentOnOverService(session?.user) ? <ProfileOverService /> : null}
      </div>
    </>
  );
}
