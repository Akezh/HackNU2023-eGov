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
  } else {
    return "Доставлено";
  }
};
