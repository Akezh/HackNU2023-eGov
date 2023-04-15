import "styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { ModalProvider } from "../providers";
import { RoleProvider } from "../providers/Role";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoleProvider>
      <ModalProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </ModalProvider>
    </RoleProvider>
  );
}

export default MyApp;

// /order?iin=xxxx&orderid=xxxx
