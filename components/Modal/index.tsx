import clsx from "clsx";
import { useModalContext } from "providers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { api } from "utils";

export const Modal: React.FC = () => {
  const { state: modalState, setModalState } = useModalContext();
  const showModal = modalState.type !== "NO_MODAL";
  const [otp, setOtp] = useState("");

  const handleSubmitOtp = async () => {
    if (
      modalState.type !== "ASK_OTP_FROM_CLIENT" &&
      modalState.type !== "ASK_OTP_FROM_COURIER"
    ) {
      setModalState({ type: "NO_MODAL" });
      return;
    }

    if (modalState.type === "ASK_OTP_FROM_CLIENT") {
      try {
        await api.post("/complete-delivery", {
          otp,
          orderId: modalState.orderId,
        });
        toast.success("Заказ успешно доставлен.");
        setModalState({ type: "NO_MODAL" });
      } catch (_) {
        toast.error("Похоже что OTP введен неверный.");
      }
    } else {
      try {
        await api.post("/courier-pick-up", {
          otp,
          orderId: modalState.orderId,
        });
        toast.success("Заказ успешно отдан курьеру.");
        setModalState({ type: "NO_MODAL" });
      } catch (_) {
        toast.error("Похоже что OTP введен неверный.");
      }
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center h-screen bg-gray-200 modal-body absolute",
        showModal && "modal-active"
      )}
      style={{ zIndex: 1000 }}
    >
      <div
        className={clsx(
          "fixed top-0 left-0 flex items-center justify-center w-full h-full modal",
          !showModal && "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
          onClick={() => setModalState({ type: "NO_MODAL" })}
        ></div>

        <div className="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-lg">
          <div className="px-6 py-4 text-left modal-content">
            <div className="flex items-center justify-between pb-3">
              <p className="text-2xl font-bold">Подтверждение</p>
            </div>
            <p>
              {modalState.type === "ASK_OTP_FROM_CLIENT"
                ? "Пожалуйста введите OTP, который пришел клиенту на мобильный номер."
                : "Пожалуйста введите OTP, который пришел курьеру на мобильный номер."}
            </p>
            <input
              type="text"
              className="px-3 py-1 mt-2 border border-gray-200 rounded-md"
              placeholder="OTP"
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                disabled={otp.length === 0}
                className="px-3 py-2 text-white bg-green-500 rounded-lg modal-close hover:opacity-90 transition-opacity disabled:opacity-40"
                onClick={handleSubmitOtp}
              >
                Завершить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
