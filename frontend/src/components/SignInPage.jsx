"use client";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import TypeWriterText from "./TypeWriterText";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async () => {
    const isOk = await signInWithGoogle();
    if (isOk) router.push("/dashboard");
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <div className="text-6xl min-h-[100px]">
        <TypeWriterText finalText="Vanrakshak - Sign In" />
      </div>
      <Button
        color="blue"
        onClick={handleSignIn}
        icon={ArrowRightEndOnRectangleIcon}
      >
        Sign In
      </Button>
    </main>
  );
}
