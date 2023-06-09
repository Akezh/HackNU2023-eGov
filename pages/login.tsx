import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Footer } from "../components/Footer";
import { useProviderContext } from "../providers/Role";
import { api, base } from "../utils";

type IFormInput = {
  role: "courier-users" | "gov-users";
  email: string;
  password: string;
};

type LoginAxiosResponse = {
  message: string;
  token: string;
  exp: string;
  user: {
    id: string;
    service: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

const Login: NextPage = () => {
  const router = useRouter();
  const context = useProviderContext();
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const url =
      data.role === "courier-users"
        ? `${base}/courier-users/login`
        : `${base}/gov-users/login`;

    const currentRole =
      data.role === "courier-users" ? "COURIER" : "GOVERNMENT";

    try {
      const response = await axios.post<LoginAxiosResponse>(url, {
        email: data.email,
        password: data.password,
      });
      if (!response?.data.token) throw new Error("Неверный логин или пароль");

      api.defaults.headers.common[
        "Authorization"
      ] = `JWT ${response.data.token}`;

      localStorage.setItem(
        "lastRole",
        JSON.stringify({
          role: currentRole,
          user: response.data.user,
          token: response.data.token,
        })
      );
      context.setRoleState({
        role: currentRole,
        user: response.data.user,
        token: response.data.token,
        loaded: true,
      });
      toast.success(
        "Вы успешно вошли в систему. Перенаправляем на страницу трекинга заказов"
      );
      router.push("/");
    } catch (e: unknown) {
      toast.error(
        (e as Error).message || "Что-то пошло не так. Попробуйте еще раз"
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="relative text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col w-full mb-12 text-center">
              <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font">
                Вход в учетную запись
              </h1>
              <p className="mx-auto text-base leading-relaxed lg:w-2/3">
                Выберите роль, которую вы хотите использовать для входа в
                систему.
              </p>
            </div>
            <div className="mx-auto lg:w-1/2 md:w-2/3">
              <div className="flex flex-wrap -m-2">
                <div className="w-full p-2">
                  <label
                    htmlFor="input"
                    className="text-sm text-gray-600 leading-7"
                  >
                    Выберите сервис доставки
                  </label>
                  <select
                    {...register("role")}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  >
                    <option value="courier-users">Курьер</option>
                    <option value="gov-users">Оператор ЦОНа</option>
                  </select>
                </div>
                <div className="w-full p-2">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Логин
                    </label>
                    <input
                      type="text"
                      {...register("email")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="w-full p-2">
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="text-sm text-gray-600 leading-7"
                    >
                      Пароль
                    </label>
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full px-3 py-1 text-base text-gray-700 bg-gray-100 border border-gray-300 rounded outline-none bg-opacity-50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="w-full p-2 mt-4">
                  <button
                    type="submit"
                    className="flex px-8 py-2 mx-auto text-lg text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600"
                  >
                    Войти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
      <Footer />
    </>
  );
};

export default Login;
