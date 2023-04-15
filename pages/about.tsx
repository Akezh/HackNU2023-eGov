import type { NextPage } from "next";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const About: NextPage = () => {
  return (
    <>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="container flex flex-col px-5 py-16 mx-auto">
          <div className="mx-auto lg:w-4/6">
            <div className="h-64 overflow-hidden rounded-lg">
              <img
                alt="content"
                className="object-cover object-center w-full h-full"
                src="https://dummyimage.com/1200x500"
              />
            </div>
            <div className="flex flex-col mt-10 sm:flex-row">
              <div className="text-center sm:w-1/3 sm:pr-8 sm:py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 text-gray-400 bg-gray-200 rounded-full">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="mt-4 text-lg font-medium text-gray-900 title-font">
                    Phoebe Caulfield
                  </h2>
                  <div className="w-12 h-1 mt-2 mb-4 bg-indigo-500 rounded"></div>
                  <p className="text-base">
                    Raclette knausgaard hella meggs normcore williamsburg enamel
                    pin sartorial venmo tbh hot chicken gentrify portland.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 text-center border-t border-gray-200 sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l sm:border-t-0 sm:mt-0 sm:text-left">
                <p className="mb-4 text-lg leading-relaxed">
                  Добро пожаловать на наш сайт! Мы являемся онлайн-сервисом
                  доставки документов, который специализируется на доставке
                  государственных документов прямо до дверей наших клиентов.
                  Наша миссия заключается в том, чтобы сделать процесс получения
                  государственных документов наиболее удобным и безопасным для
                  наших клиентов. Мы понимаем, что получение государственных
                  документов может быть сложным и времязатратным процессом,
                  поэтому мы стремимся облегчить жизнь нашим клиентам,
                  предоставляя им возможность заказывать доставку документов
                  онлайн. Мы гордимся тем, что наш сервис помогает нашим
                  клиентам сэкономить время и избавиться от лишних хлопот,
                  позволяя им сконцентрироваться на более важных задачах.
                  Спасибо, что выбрали наш сервис доставки документов!
                </p>
                <a className="inline-flex items-center text-indigo-500">
                  Подробнее
                  <svg
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
