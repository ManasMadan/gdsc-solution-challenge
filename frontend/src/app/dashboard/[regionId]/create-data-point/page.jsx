"use client";
import { ArrowUturnLeftIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { Card } from "@tremor/react";
import { TextInput } from "@tremor/react";
import { Title } from "@tremor/react";
import { Button } from "@tremor/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { NumberInput } from "@tremor/react";
import axios from "axios";

export default function page({ params: { regionId } }) {
  async function getBase64(id) {
    const file = document.getElementById(id).files[0];
    if (!file) return;
    const reader = new FileReader();
    let res;
    const myPromise = () =>
      new Promise((resolve) => {
        reader.onload = function (e) {
          res = reader.result;
          resolve();
        };
        reader.readAsDataURL(file);
      });
    await myPromise();
    return res;
  }
  const inputValue = (id) => document.getElementById(id).value;
  const router = useRouter();
  const addDataEntry = async () => {
    await axios.post("/api/add-datapoint/" + regionId, {
      parameters: {
        latitude: parseFloat(inputValue("latitude")) || -11.807,
        longitude: parseFloat(inputValue("longitude")) || 142.0583,
        brightness: parseFloat(inputValue("brightness")) || 313.0,
        scan: parseFloat(inputValue("scan")) || 1.0,
        track: parseFloat(inputValue("track")) || 1.0,
        acq_date: inputValue("acq_date") || "2019-08-01",
        acq_time: parseFloat(inputValue("acq_time")) || 56,
        satellite: inputValue("satellite") || "Terra",
        instrument: inputValue("instrument") || "MODIS",
        version: parseFloat(inputValue("version")) || 6.3,
        bright_t31: parseFloat(inputValue("bright_t31")) || 297.3,
        frp: parseFloat(inputValue("frp")) || 6.6,
        daynight: inputValue("daynight") || "D",
        type: parseFloat(inputValue("type")) || 0,
      },
      image: await getBase64("image"),
      audio: await getBase64("audio"),
    });
  };
  return (
    <main className="flex flex-col gap-8 container py-12">
      <Link href={"/dashboard/" + regionId} className="w-fit">
        <Button color="red" icon={ArrowUturnLeftIcon}>
          Go Back
        </Button>
      </Link>
      <Card decoration="top">
        <Title>Create Data Point</Title>
      </Card>
      <Card decoration="top" className="grid gap-4">
        <Title>Data Point Details</Title>
        <NumberInput placeholder="Latitude" id="latitude" />
        <NumberInput placeholder="Longitude" id="longitude" />
        <NumberInput placeholder="Brightness" id="brightness" />
        <NumberInput placeholder="Scan" id="scan" />
        <NumberInput placeholder="Track" id="track" />
        <TextInput placeholder="Acquired Date" id="acq_date" />
        <NumberInput placeholder="Acquired Time" id="acq_time" />
        <TextInput placeholder="Satellite" id="satellite" />
        <TextInput placeholder="Instrument" id="instrument" />
        <NumberInput placeholder="Version" id="version" />
        <NumberInput placeholder="Brightness" id="bright_t31" />
        <NumberInput placeholder="FRP" id="frp" />
        <TextInput placeholder="Daynight" id="daynight" />
        <NumberInput min={0} max={2} placeholder="Type (0-2)" id="type" />
      </Card>
      <div className="flex gap-4">
        <Card decoration="top" className="grid gap-4 dark:text-white">
          <Title>Audio File</Title>
          <input id="audio" type="file" accept=".wav" />
        </Card>
        <Card decoration="top" className="grid gap-4 dark:text-white">
          <Title>Aerial Image</Title>
          <input id="image" type="file" accept=".jpg" />
        </Card>
      </div>
      <Button
        className="w-full py-12"
        onClick={async () => {
          try {
            await addDataEntry();
            toast.success("Created Datapoint");
          } catch (e) {
            toast.error("Something went Wrong !");
          }
          router.push("/dashboard/" + regionId);
        }}
      >
        <span className="flex items-center gap-4">
          <PlusCircleIcon color="white" width={50} />
          <Title>Create Data Point</Title>
        </span>
      </Button>
    </main>
  );
}
