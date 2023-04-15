import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

type IFormInput = {
  iin: string;
  orderid: string;
  eGovServiceName: string;
  eGovBuildingAddress: string;
  myCredentials: string;
  believerCredentials: string;
  phoneNumber: string;
  region: string;
  city: string;
  street: string;
  houseNumber: string;
  flatNumber: string;
  entranceNumber: string;
  floorNumber: string;
  buildingSection: string;
  buildingName: string;
  deliveryService: "yandex" | "kaspi" | "exline";
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

const API_URL = "http://localhost:8080/api";

const Order: NextPage = () => {
  const router = useRouter();
  const { iin: queryIIN, orderId: queryOrderId } = router.query;
  const { setValue, register, handleSubmit } = useForm<IFormInput>();

  useEffect(() => {
    if (queryIIN && queryOrderId) {
      setValue("iin", queryIIN as string);
      setValue("orderid", queryOrderId as string);
    }
  }, [queryIIN, queryOrderId, register, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    const fullAddress = `${formData.region}, ${formData.city}, ${formData.street}, ${formData.houseNumber}, ${formData.flatNumber}, ${formData.entranceNumber}, ${formData.floorNumber}, ${formData.buildingSection}, ${formData.buildingName}`;
    const data = {
      id: formData.orderid,
      fullName: formData.myCredentials,
      fullDependantName: formData.believerCredentials,
      fullAddress,
      deliveryService: "yandex",
      userIIN: formData.iin,
      serviceName: formData.eGovServiceName,
      govAddress: formData.eGovBuildingAddress,
    };

    try {
      await axios.post<AxiosResponse>(`${API_URL}/orders`, data);
      toast.success("Заказ успешно создан, следите за статусом");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl">
        <section className="text-gray-600 body-font">
          <div className="container flex flex-col items-center px-5 pt-24 mx-auto md:flex-row">
            <div className="flex flex-col items-center mb-16 text-center lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 md:items-start md:text-left md:mb-0">
              <h1 className="mb-4 text-3xl font-medium text-gray-900 title-font sm:text-4xl">
                Вас приветствует сервис доставки документов
              </h1>
              <p className="mb-8 leading-relaxed">
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
                style={{ width: 450, height: 300 }}
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
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
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
                        ФИО пользователя
                      </label>
                      <input
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
                        Номер телефона
                      </label>
                      <input
                        type="text"
                        {...register("phoneNumber")}
                        className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative text-gray-600 body-font">
            <div className="container flex flex-wrap px-5 pb-16 mx-auto sm:flex-nowrap">
              <div className="relative flex items-end justify-start p-10 overflow-hidden bg-gray-300 rounded-lg lg:w-2/3 md:w-1/2 sm:mr-10">
                <iframe
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  title="map"
                  src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=%C4%B0zmir+(My%20Business%20Name)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
                ></iframe>
                <div className="relative flex flex-wrap py-6 bg-white rounded shadow-md">
                  <div className="px-6 lg:w-1/2">
                    <h2 className="text-xs font-semibold tracking-widest text-gray-900 title-font">
                      ADDRESS
                    </h2>
                    <p className="mt-1">
                      Photo booth tattooed prism, portland taiyaki hoodie neutra
                      typewriter
                    </p>
                  </div>
                  <div className="px-6 mt-4 lg:w-1/2 lg:mt-0">
                    <h2 className="text-xs font-semibold tracking-widest text-gray-900 title-font">
                      EMAIL
                    </h2>
                    <a className="leading-relaxed text-indigo-500">
                      example@email.com
                    </a>
                    <h2 className="mt-4 text-xs font-semibold tracking-widest text-gray-900 title-font">
                      PHONE
                    </h2>
                    <p className="leading-relaxed">123-456-7890</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full mt-8 bg-white lg:w-1/3 md:w-1/2 md:ml-auto md:py-8 md:mt-0">
                <h2 className="mb-1 text-lg font-medium text-gray-900 title-font">
                  Данные для доставки
                </h2>
                <p className="mb-5 leading-relaxed text-gray-600">
                  Post-ironic portland shabby chic echo park, banjo fashion axe
                </p>
                <div className="flex flex-wrap -m-2">
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Область
                    </label>
                    <input
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
                      Город
                    </label>
                    <input
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
                      Улица
                    </label>
                    <input
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
                      Номер дома
                    </label>
                    <input
                      type="text"
                      {...register("houseNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Квартира
                    </label>
                    <input
                      type="text"
                      {...register("flatNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Подъезд
                    </label>
                    <input
                      type="text"
                      {...register("entranceNumber")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Этаж
                    </label>
                    <input
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
                      type="text"
                      {...register("buildingName")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <label
                      htmlFor="input"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Выберите сервис доставки
                    </label>
                    <select
                      {...register("deliveryService")}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                      <option value="yandex">Yandex</option>
                      <option value="kaspi">Kaspi</option>
                      <option value="exline">Exline</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 mt-6 text-lg text-white bg-yellow-500 border-0 rounded focus:outline-none hover:bg-yellow-600"
                >
                  Вызвать доставку
                </button>
                <p className="mt-3 text-xs text-gray-500">
                  Chicharrones blog helvetica normcore iceland tousled brook
                  viral artisan.
                </p>
              </div>
            </div>
          </section>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Order;
