import Link from "next/link";
import React from "react";

import { useProviderContext } from "../../providers/Role";

export const Header = () => {
  const context = useProviderContext();

  const signOut = () => {
    localStorage.removeItem("lastRole");
    window.location.pathname = "/login";
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container flex flex-col flex-wrap items-center py-5 mx-auto md:flex-row max-w-7xl">
        <Link
          href="/order"
          className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0"
        >
          <img
            style={{
              borderRadius: "50%",
              width: 48,
              height: 48,
              cursor: "pointer",
            }}
            alt="logo"
            src="https://cdn.discordapp.com/attachments/1073158756369698878/1096728440914333696/Akezh_create_logo_for_the_team_name_The_Glider_png_software_eng_b961e972-a6e8-4cae-bf98-32da6e15a960.png"
          />
        </Link>
        <span className="ml-3 text-xl">eGov Доставка</span>
        {(context.state.role === "COURIER" ||
          context.state.role === "GOVERNMENT") && (
          <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400">
            <p>
              {context.state.role === "COURIER"
                ? `Панель курьера - ${context.state.user.email}`
                : `Панель работника ЦОН - ${context.state.user.email}`}
            </p>
            {/* <Link href="/order">
            <span className="mr-5 cursor-pointer hover:text-gray-900">
              Доставка
            </span>
          </Link>
          <Link href="/order-traking">
            <span className="mr-5 cursor-pointer hover:text-gray-900">
              Отслеживание статуса
            </span>
          </Link>
          <Link href="/about">
            <span className="mr-5 cursor-pointer hover:text-gray-900">
              О нас
            </span>
          </Link> */}
          </nav>
        )}
        {context.state.role !== "USER" && (
          <button
            onClick={signOut}
            className="inline-flex items-center px-3 py-1 mx-auto mt-4 text-base bg-gray-100 border-0 rounded md:ml-auto focus:outline-none hover:bg-gray-200 md:mt-0 md:mx-0"
          >
            Выйти
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};
