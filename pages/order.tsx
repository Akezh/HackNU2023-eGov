import {
  GeolocationControl,
  Map,
  Placemark,
  Polyline,
  YMaps,
} from "@pbe/react-yandex-maps";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Footer } from "../components/Footer";
import {
  base,
  calculateDistance,
  OrderStatus,
  orderStatusToString,
} from "../utils";

type IFormInput = {
  iin: string;
  orderid: string;
  eGovServiceName: string;
  eGovBuildingAddress: string;
  myCredentials: string;
  believerCredentials: string;
  phone: string;
  region: string;
  city: string;
  street: string;
  houseNumber: string;
  flatNumber: string;
  entranceNumber: string;
  floorNumber: string;
  buildingSection: string;
  buildingName: string;
  deliveryService: "yandex" | "inDrive" | "uwu";
  agreeOffer: boolean;
  agreeConfidentiality: boolean;
};

type AxiosResponse = {
  doc: {
    createdAt: string;
    deliveryService: string;
    fullAddress: string;
    fullName: string;
    id: string;
    status: string;
    updatedAt: string;
  };
  message: string;
};

type AxiosResponseDeliveryStatus = {
  docs: Array<{
    id: string;
    fullName: string;
    fullDependantName: string;
    fullAddress: string;
    deliveryService: string;
    userIIN: string;
    serviceName: string;
    govAddress: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
  }>;
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null;
  nextPage: null;
};

const getEgovService = (requestId: string, requestIIN: string) =>
  `http://89.218.80.61/vshep-api/con-sync-service?requestId=${requestId}&requestIIN=${requestIIN}&token=eyJG6943LMReKj_kqdAVrAiPbpRloAfE1fqp0eVAJ-IChQcV-kv3gW-gBAzWztBEdFY`;

const Order: NextPage = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const router = useRouter();
  const { iin: queryIIN, orderid: queryOrderId } = router.query;
  const { getValues, setValue, register, handleSubmit } = useForm<IFormInput>();
  const [orderData, setOrderData] =
    useState<AxiosResponseDeliveryStatus | null>(null);
  const [isOrderStatusLoading, setIsOrderStatusLoading] = useState(false);
  const [addressFromYandex, setAddressFromYandex] = useState("");
  const [customPath, setCustomPath] = useState([
    [51.0904356, 71.3952538],
    [51.091197, 71.392013],
    [51.127035, 71.404736],
    [51.128159, 71.395819],
    [51.1294167, 71.3960702],
  ]); // this is mocked path from NU to gov building. should be replaced with real path
  const [price, setPrice] = useState(0);
  const center = [51.0904356, 71.3952538];
  const govBuildingCoords = [51.1294167, 71.3960702];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        const apiUrl = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=cc3af3ca-83be-4565-a80e-3ea36c6ef9fe&geocode=${longitude},${latitude}`;
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const address =
              data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            setAddressFromYandex(address);
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
          });
      });

      const distance = calculateDistance(
        center[0],
        center[1],
        govBuildingCoords[0],
        govBuildingCoords[1]
      );
      const basePrice = 200; // Base price per km
      const yandexPrice = Math.round(500 + basePrice * (distance / 1000)); // Price in rubles
      setPrice(yandexPrice);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (queryIIN && queryOrderId) {
      setValue("iin", queryIIN as string);
      setValue("orderid", queryOrderId as string);
      const egovServiceUrl = getEgovService(
        queryOrderId as string,
        queryIIN as string
      );
      axios
        .get(egovServiceUrl)
        .then((response) => {
          const { serviceType, organization } = response.data.data;
          setValue("eGovServiceName", serviceType?.nameRu || "");
          setValue("eGovBuildingAddress", organization?.nameRu || "");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [queryIIN, queryOrderId, register, setValue]);

  const getDeliveryStatus = useCallback(async () => {
    try {
      const { iin, orderid } = getValues();
      const response = await axios.get<AxiosResponseDeliveryStatus>(
        `${base}/orders?where[userIIN][equals]=${iin}&where[id][equals]=${orderid}`
      );

      const curOrderStatus = response.data.docs[0].status;
      setOrderData(response.data);
      toast.success(orderStatusToString(curOrderStatus));
    } catch (e) {
      console.log(e);
    }
  }, [getValues]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    const fullAddress = `${formData.region}, ${formData.city}, ${formData.street}, ${formData.houseNumber}, ${formData.flatNumber}, ${formData.entranceNumber}, ${formData.floorNumber}, ${formData.buildingSection}, ${formData.buildingName}`;
    const data = {
      id: formData.orderid,
      fullName: formData.myCredentials,
      fullDependantName: formData.believerCredentials,
      fullAddress,
      deliveryService: formData.deliveryService,
      userIIN: formData.iin,
      serviceName: formData.eGovServiceName,
      govAddress: formData.eGovBuildingAddress || "Керей-Жанибек Хандар, 4/1",
      phone: formData.phone,
    };
    setIsOrderStatusLoading(true);

    try {
      await axios.post<AxiosResponse>(`${base}/create-order`, data);
      toast.success("Заказ успешно создан, следите за статусом");
      await getDeliveryStatus();
    } catch (error) {
      console.log(error);
    }

    setIsOrderStatusLoading(false);
    setIsFormSubmitted(true);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <section className="text-gray-600 body-font">
          <div className="container flex flex-col items-center pt-24 mx-auto md:flex-row">
            <div className="flex flex-col items-center mb-16 text-center lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:items-start md:text-left md:mb-0">
              <h1 className="mb-4 text-3xl font-medium text-gray-900 title-font sm:text-4xl">
                Вас приветствует сервис доставки документов
              </h1>
              <p className="mb-2 leading-relaxed">
                Добро пожаловать на наш сайт! Мы - онлайн-сервис доставки
                государственных документов прямо до дверей клиентов. Наша миссия
                - сделать получение документов удобным и безопасным. Заказывайте
                доставку документов онлайн и сэкономьте время. Спасибо за выбор
                нашего сервиса!
              </p>
              <div className="flex items-center">
                <img
                  alt="logo"
                  style={{ height: 100 }}
                  src="https://cdn.discordapp.com/attachments/1073158756369698878/1096728646695264296/2020_01_15_foto-e-gov.jpg"
                />
                <img
                  style={{
                    marginLeft: 24,
                    borderRadius: "50%",
                    width: 72,
                    height: 72,
                  }}
                  alt="logo"
                  src="https://cdn.discordapp.com/attachments/1073158756369698878/1096728440914333696/Akezh_create_logo_for_the_team_name_The_Glider_png_software_eng_b961e972-a6e8-4cae-bf98-32da6e15a960.png"
                />
              </div>
            </div>
            <div className="w-5/6 lg:max-w-lg lg:w-full md:w-1/2">
              <img
                className="object-cover object-center rounded shadow-lg"
                style={{ width: "100%" }}
                alt="hero"
                src="https://cdn.discordapp.com/attachments/1073158756369698878/1096719848236650577/ss_Online_delivery_service_concept_online_order_tracking_delive_21ca1d2c-5af4-4a18-8ee3-0d8e407cff7e.png"
              />
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="relative text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col w-full mb-12 text-center">
                <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font">
                  Детали для доставки
                </h1>
                <p className="mx-auto text-base leading-relaxed lg:w-2/3">
                  Заполните необходимые поля чтобы доставить ваши документы
                  прямо до двери.
                </p>
              </div>
              <div className="mx-auto lg:w-1/2 md:w-2/3">
                <div className="flex flex-wrap -m-2">
                  <div className="w-1/2 p-2">
                    <div className="relative">
                      <label
                        htmlFor="name"
                        className="text-sm text-gray-600 leading-7"
                      >
                        ИИН
                      </label>
                      <input
                        disabled
                        type="text"
                        {...register("iin")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-400 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="w-1/2 p-2">
                    <div className="relative">
                      <label
                        htmlFor="input"
                        className="text-sm text-gray-600 leading-7"
                      >
                        Номер заявки
                      </label>
                      <input
                        disabled
                        type="text"
                        {...register("orderid")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-400 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>

                  <div className="w-1/2 p-2">
                    <div className="relative">
                      <label
                        htmlFor="input"
                        className="text-sm text-gray-600 leading-7"
                      >
                        Название госуслуги
                      </label>
                      <input
                        disabled
                        type="text"
                        {...register("eGovServiceName")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-400 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="w-1/2 p-2">
                    <div className="relative">
                      <label
                        htmlFor="input"
                        className="text-sm text-gray-600 leading-7"
                      >
                        Адрес отделения/ЦОН
                      </label>
                      <input
                        disabled
                        type="text"
                        {...register("eGovBuildingAddress")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-400 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="w-full p-2">
                    <div className="relative">
                      <label
                        htmlFor="input"
                        className="text-sm text-gray-600 leading-7"
                      >
                        ФИО пользователя <span className="text-red-500">*</span>
                      </label>
                      <input
                        disabled={isFormSubmitted}
                        required
                        type="text"
                        {...register("myCredentials")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="w-full p-2">
                    <div className="relative">
                      <label
                        htmlFor="input"
                        className="text-sm text-gray-600 leading-7"
                      >
                        ФИО доверенного лица
                      </label>
                      <input
                        disabled={isFormSubmitted}
                        type="text"
                        {...register("believerCredentials")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                  <div className="w-full p-2">
                    <div className="relative">
                      <label
                        htmlFor="input"
                        className="text-sm text-gray-600 leading-7"
                      >
                        Номер телефона <span className="text-red-500">*</span>
                      </label>
                      <input
                        disabled={isFormSubmitted}
                        required
                        type="text"
                        {...register("phone")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative text-gray-600 body-font">
            <div className="container flex flex-wrap px-5 mx-auto sm:flex-nowrap">
              <div className="relative flex items-center justify-start my-10 overflow-hidden bg-gray-300 rounded-lg lg:w-2/3 md:w-1/2 sm:mr-10">
                <YMaps
                  query={{ apikey: "cc3af3ca-83be-4565-a80e-3ea36c6ef9fe" }}
                >
                  <Map
                    style={{ width: "100%", height: "100%" }}
                    defaultState={{ center, zoom: 15 }}
                  >
                    <GeolocationControl options={{ float: "right" }} />
                    <Placemark geometry={govBuildingCoords} />
                    <Placemark geometry={center} />
                    <Polyline
                      geometry={customPath}
                      options={{ strokeWidth: 3 }}
                    />
                  </Map>
                </YMaps>
              </div>
              <div className="flex flex-col w-full mt-8 bg-white lg:w-1/3 md:w-1/2 md:py-8 md:mt-0">
                <h2 className="mb-1 text-lg font-medium text-gray-900 title-font">
                  Данные для доставки
                </h2>
                <div className="flex flex-wrap -m-2">
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Область
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      type="text"
                      {...register("region")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Город <span className="text-red-500">*</span>
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      required
                      type="text"
                      {...register("city")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Улица <span className="text-red-500">*</span>
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      required
                      type="text"
                      {...register("street")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Номер дома <span className="text-red-500">*</span>
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      required
                      type="text"
                      {...register("houseNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Квартира
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      type="text"
                      {...register("flatNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Подъезд
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      type="text"
                      {...register("entranceNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Этаж
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      type="text"
                      {...register("floorNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Корпус
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      type="text"
                      {...register("buildingSection")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Название ЖК
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      type="text"
                      {...register("buildingName")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-full p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Сервис доставки
                    </label>
                    <select
                      disabled={isFormSubmitted}
                      {...register("deliveryService")}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                      <option value="yandex">Yandex</option>
                      <option value="inDrive">inDrive</option>
                      <option value="uwu">UwU</option>
                    </select>
                  </div>

                  <div className="w-2/3 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Сгенерированный адрес доставки
                    </label>
                    <input
                      disabled={isFormSubmitted}
                      value={addressFromYandex}
                      type="text"
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Стоимость
                    </label>
                    <input
                      disabled
                      value={`${price} тенге`}
                      type="text"
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="inline-flex items-center justify-between mt-3">
                  <input
                    disabled={isFormSubmitted}
                    required
                    {...register("agreeOffer")}
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 form-checkbox"
                  />
                  <span className="ml-3 text-xs text-gray-500">
                    Я принимаю условия публичного договора-оферты
                  </span>
                </div>
                <div className="inline-flex items-center justify-between mt-3">
                  <input
                    disabled={isFormSubmitted}
                    required
                    {...register("agreeConfidentiality")}
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 form-checkbox"
                  />
                  <span className="ml-3 text-xs text-gray-500">
                    Я ознакомлен с политикой конфиденциальности
                  </span>
                </div>
                <button
                  disabled={isFormSubmitted}
                  type="submit"
                  className="px-6 py-2 mt-6 text-lg text-white bg-yellow-500 border-0 rounded focus:outline-none hover:bg-yellow-600"
                >
                  Вызвать доставку
                </button>
              </div>
            </div>
          </section>
        </form>

        {isOrderStatusLoading && (
          <div className="flex items-center justify-center mb-16">
            <img
              style={{ height: 100, width: 300 }}
              alt="loader"
              src="https://miro.medium.com/v2/resize:fit:4800/1*CsJ05WEGfunYMLGfsT2sXA.gif"
            />
          </div>
        )}

        {isFormSubmitted && !isOrderStatusLoading && (
          <div className="mt-8 mb-16">
            <p className="text-2xl font-medium mb-7">Инфомация о заказе</p>
            <div
              style={{ width: 500 }}
              className="flex items-center justify-between mb-2 gap-2"
            >
              <p className="font-medium text-md">Статус заказа:</p>
              <p className="font-medium text-green-600 text-md text-end">
                {orderStatusToString(orderData?.docs[0].status as string)}
              </p>
            </div>
            <div
              style={{ width: 500 }}
              className="flex items-center justify-between mb-2 gap-2"
            >
              <p className="font-medium text-md">Время создания: </p>
              <p className="font-medium text-green-600 text-md text-end">
                {new Date(
                  orderData?.docs[0].createdAt || Date.now()
                ).toLocaleString()}
              </p>
            </div>
            <div
              style={{ width: 500 }}
              className="flex items-center justify-between mb-2 gap-2"
            >
              <p className="font-medium text-md">Название сервиса:</p>
              <p className="font-medium text-green-600 text-md text-end">
                {orderData?.docs[0].serviceName}
              </p>
            </div>

            <button
              type="submit"
              onClick={getDeliveryStatus}
              className="px-6 py-2 mt-4 text-lg text-white bg-yellow-500 border-0 rounded focus:outline-none hover:bg-yellow-600"
            >
              Обновить статус доставки
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Order;
