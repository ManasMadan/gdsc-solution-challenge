"use client";
import { useAuth } from "@/lib/AuthContext";
import { createRegion } from "@/lib/firebase/firestore";
import { ArrowUturnLeftIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { TextInput } from "@tremor/react";
import { Button } from "@tremor/react";
import { Card, Title } from "@tremor/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function page() {
  const { user } = useAuth();
  const inputValue = (id) => document.getElementById(id).value;
  const router = useRouter();
  return (
    <main className="flex flex-col gap-8 container py-12">
      <Link href="/dashboard" className="w-fit">
        <Button color="red" icon={ArrowUturnLeftIcon}>
          Go Back
        </Button>
      </Link>
      <Card decoration="top">
        <Title>Create Region</Title>
      </Card>
      <Card decoration="top" className="grid gap-4">
        <Title>Region Details</Title>
        <TextInput id="name" placeholder="Region Name" />
        <TextInput id="area" placeholder="Region Area Name" />
      </Card>
      <Button
        className="w-full py-12"
        onClick={async () => {
          try {
            await createRegion(
              inputValue("name"),
              inputValue("area"),
              user.uid
            );
            toast.success("Created Region with name " + inputValue("name"));
          } catch (e) {
            toast.error("Something went Wrong !");
          }
          router.push("/dashboard");
        }}
      >
        <span className="flex items-center gap-4">
          <PlusCircleIcon color="white" width={50} />
          <Title>Create Region</Title>
        </span>
      </Button>
    </main>
  );
}
