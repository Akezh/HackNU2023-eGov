import React from "react";

export const Footer = () => {
  return (
    <footer className="hidden text-gray-600 body-font">
      <div className="container flex flex-col items-center px-5 py-8 mx-auto sm:flex-row">
        <a className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start">
          <img
            style={{ borderRadius: "50%", width: 64, height: 64 }}
            alt="logo"
            src="https://cdn.discordapp.com/attachments/1073158756369698878/1096728440914333696/Akezh_create_logo_for_the_team_name_The_Glider_png_software_eng_b961e972-a6e8-4cae-bf98-32da6e15a960.png"
          />
          <span className="ml-3 text-xl">The Glider Team</span>
        </a>
        <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0">
          © 2023 Designed & Crafted by
          <a
            href="https://twitter.com/knyttneve"
            className="ml-1 text-gray-600"
            rel="noopener noreferrer"
            target="_blank"
          >
            Temirzhan Yussupov, Mukhataev Batyrbek, Akezhan Rakishev
          </a>
        </p>
        <span className="inline-flex justify-center mt-4 sm:ml-auto sm:mt-0 sm:justify-start">
          <a className="ml-3 text-gray-500">
            <svg
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/akezhan-rakishev-841505170/"
            className="ml-3 text-gray-500"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                stroke="none"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              ></path>
              <circle cx="4" cy="4" r="2" stroke="none"></circle>
            </svg>
          </a>
        </span>
      </div>
    </footer>
  );
};
