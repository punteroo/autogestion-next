"use client";

import { Student } from "@/lib/models/student.model";
import { Button, User } from "@nextui-org/react";
import { parseStudentRole } from "../../Profile/ProfileCard";
import { HamburgerIcon } from "../../Icons/HamburgerIcon";

type UserCardProps = {
  user: Partial<Student>;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex justify-between items-center border-foreground-200 border-1 rounded-xl px-4 py-2">
      <User
        name={`${user.lastName}, ${user.name}`.toUpperCase()}
        description={parseStudentRole(user?.role ?? null)}
        avatarProps={{
          src: user?.profilePicture ?? "/avatar.jpg",
        }}
      />
      <div>
        <Button variant="ghost">
          <HamburgerIcon />
        </Button>
      </div>
    </div>
  );
}
