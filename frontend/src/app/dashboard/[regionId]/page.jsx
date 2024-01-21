import Region from "@/components/Region";
import {
  getNotifications,
  getRegion,
  getRegionData,
} from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({ params }) {
  const { regionId } = params;
  const region = await getRegion(regionId);
  const data = await getRegionData(regionId);
  const notifications = await getNotifications(regionId);
  if (!region) notFound();
  return (
    <Region
      _region={JSON.stringify(region)}
      _data={JSON.stringify(data)}
      _notifications={JSON.stringify(notifications)}
      regionId={regionId}
    />
  );
}
