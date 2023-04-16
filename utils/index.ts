import axios from "axios";

export enum OrderStatus {
  STALE = "stale",
  COURIER_SELECTED = "courierSelected",
  COURIER_PICKED_UP = "courierPickedUp",
  DELIVERED = "delivered",
}

export const base = "http://localhost:8080/api";

export const api = axios.create({
  baseURL: `${base}`,
});

export const orderStatusToString = (status: string) => {
  if (status === OrderStatus.STALE) {
    return "Создан";
  } else if (status === OrderStatus.COURIER_SELECTED) {
    return "Курьер выбран";
  } else if (status === OrderStatus.COURIER_PICKED_UP) {
    return "Курьер доставляет";
  } else if (status === OrderStatus.DELIVERED) {
    return "Доставлено";
  } else {
    return "Создан";
  }
};

export const prettifyAddress = (address: string) => {
  return address
    .split(",")
    .filter((x) => x.trim().length > 0)
    .map((x) => x.trim())
    .join(", ");
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};
