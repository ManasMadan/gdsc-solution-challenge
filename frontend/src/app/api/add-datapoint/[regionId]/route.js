import {
  addDataPoint,
  addNotifications,
  updateRegion,
} from "@/lib/firebase/firestore";
import axios from "axios";
import { Timestamp } from "firebase/firestore";

export async function POST(request) {
  const arr = request.url.split("/");
  const regionId = arr[arr.length - 1];
  const body = await request.json();

  const forestFire = (
    await axios.post(process.env.BACKEND_SERVER + "/forest-fire", {
      ...body["parameters"],
    })
  ).data;
  const voiceRecording = (
    await axios.post(process.env.BACKEND_SERVER + "/voice-recording", {
      base64data: body["audio"].slice(22),
    })
  ).data;
  const imageMask = (
    await axios.post(process.env.BACKEND_SERVER + "/image-masks", {
      base64data: body["image"].slice(23),
    })
  ).data;

  const notifications = [];
  if (forestFire.prediction > 50) {
    notifications.push({
      type: "forest_fire",
      timestamp: Timestamp.fromDate(new Date()),
      regionId: regionId,
    });
  }
  if (voiceRecording.prediction.length) {
    notifications.push({
      type: "chainsaw",
      timestamp: Timestamp.fromDate(new Date()),
      regionId: regionId,
    });
  }
  await addDataPoint({
    image: body["image"],
    parameters: body["parameters"],
    timestamp: Timestamp.fromDate(new Date()),
    chainsaw_pred: voiceRecording,
    trees_pred: imageMask,
    forest_fire_pred: forestFire,
    regionId: regionId,
  });
  await addNotifications(notifications);
  await updateRegion(
    regionId,
    imageMask.predictions.trees,
    notifications.length
  );
  return Response.json({ error: false });
}
