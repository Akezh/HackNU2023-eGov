import React from "react";
import { createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
};

type ModalState =
  | NoModal
  | ProvideSummaryToClient
  | AskOTPFromClient
  | AskOTPFromCourier;

interface NoModal {
  type: "NO_MODAL";
}

interface ProvideSummaryToClient {
  type: "SUMMARY_TO_CLIENT";
  payload: {
    fullName: string;
    phoneNumber: string;
  };
}
interface AskOTPFromClient {
  type: "ASK_OTP_FROM_CLIENT";
}
interface AskOTPFromCourier {
  type: "ASK_OTP_FROM_COURIER";
}

export const ModalContext = createContext<{
  state: ModalState;
  setModalState: (newState: ModalState) => void;
}>({
  state: { type: "NO_MODAL" },
  setModalState: () => null,
});

export const useModalContext = () => {
  return useContext(ModalContext);
};

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [modalState, setModalState] = React.useState<ModalState>({
    type: "NO_MODAL",
  });

  return (
    <ModalContext.Provider value={{ state: modalState, setModalState }}>
      {children}
    </ModalContext.Provider>
  );
};
