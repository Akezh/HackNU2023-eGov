import "styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { Header, Modal } from "components";
import type { AppProps } from "next/app";
import { ModalProvider, RoleProvider } from "providers";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoleProvider>
      <ModalProvider>
        <Modal />
        <div className="px-5 mx-auto max-w-7xl">
          <Header />
          <Component {...pageProps} />
        </div>
        <ToastContainer />
      </ModalProvider>
    </RoleProvider>
  );
}

export default MyApp;
