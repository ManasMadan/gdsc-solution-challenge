"use client";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@tremor/react";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const isOk = await signOut();
    if (isOk) router.push("/sign-in");
  };

  return (
    <Button
      color="red"
      onClick={handleSignOut}
      icon={ArrowLeftEndOnRectangleIcon}
    >
      Sign Out
    </Button>
  );
}
