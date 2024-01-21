import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  increment,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

export const getRegions = async (userId) => {
  const q = query(collection(db, "regions"), where("userId", "==", userId));
  const regions = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    regions.push({ ...doc.data(), id: doc.id });
  });
  return regions;
};

export const createData = async (
  regionId,
  image,
  percentage_trees,
  notifications_increment,
  parameters
) => {
  await addDoc(collection(db, "regions"), {
    regionId: regionId,
    image: image,
    timestamp: Timestamp.fromDate(new Date()),
    percentage_trees: percentage_trees,
    notifications_count: increment(notifications_increment),
    last_updated: Timestamp.fromDate(new Date()),
    parameters: parameters,
  });
};

export const createRegion = async (name, area, userId) => {
  await addDoc(collection(db, "regions"), {
    name: name,
    area: area,
    percentage_trees: 0,
    notifications_count: 0,
    last_updated: Timestamp.fromDate(new Date()),
    userId: userId,
  });
};
export const deleteRegion = async (id) => {
  await deleteDoc(doc(db, "regions", id));
};
export const getRegion = async (id) => {
  const d = doc(db, "regions", id);
  const snapshot = getDoc(d);
  return { ...(await snapshot).data(), id: id };
};
export const getRegionData = async (regionId) => {
  const q = query(
    collection(db, "data"),
    where("regionId", "==", regionId),
    orderBy("timestamp", "desc")
  );
  const data = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};
export const addDataPoint = async (data) => {
  await addDoc(collection(db, "data"), data);
};
export const addNotifications = async (notifications) => {
  notifications.forEach(
    async (data) => await addDoc(collection(db, "notifications"), data)
  );
};
export const getNotifications = async (regionId) => {
  const q = query(
    collection(db, "notifications"),
    where("regionId", "==", regionId),
    orderBy("timestamp", "desc")
  );
  const data = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};
export const deleteNotification = async (id, regionId) => {
  await deleteDoc(doc(db, "notifications", id));
  updateDoc(doc(db, "regions", regionId), {
    notifications_count: increment(-1),
  });
};
export const updateRegion = async (
  regionId,
  percentage_trees,
  notifications_increment
) => {
  updateDoc(doc(db, "regions", regionId), {
    notifications_count: increment(notifications_increment),
    percentage_trees: percentage_trees,
    last_updated: Timestamp.fromDate(new Date()),
  });
};
