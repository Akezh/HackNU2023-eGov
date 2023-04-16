import { Spinner } from "components";
import { useModalContext, useProviderContext } from "providers";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";
import { api, OrderStatus, orderStatusToString, prettifyAddress } from "utils";

export const GovUI = () => {
  const [myOrders, setMyOrders] = useState<any>(null);
  const modalData = useModalContext();

  const fetchMyOrders = useCallback(async () => {
    setMyOrders(null);
    const query = {
      status: {
        not_equals: OrderStatus.DELIVERED,
      },
    };

    const stringifiedQuery = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: true }
    );

    const response = await api.get(`/orders${stringifiedQuery}`);
    setMyOrders(response.data.docs);
  }, []);

  const handleClick = useCallback(
    async (orderId: any) => {
      const { data } = await api.post("/send-otp-to-courier", { orderId });
      console.log("data", data);

      modalData.setModalState({
        type: "ASK_OTP_FROM_COURIER",
        orderId,
      });
    },
    [modalData]
  );

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="mt-4">
      <p className="text-2xl font-medium mb-7">Заявки в ЦОН</p>
      {myOrders === null ? (
        <Spinner className="w-8 h-8" />
      ) : myOrders.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table
            className="w-full text-sm text-left text-gray-500"
            style={{ minWidth: 768 }}
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Полное имя
                </th>
                <th scope="col" className="px-6 py-3">
                  Полный адрес
                </th>
                <th scope="col" className="px-6 py-3">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((row: any, i: number) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0 ? "bg-white border-b" : "border-b bg-gray-50"
                  }
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {row.fullName}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {prettifyAddress(row.fullAddress)}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {orderStatusToString(row.status)}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <button
                      className="px-4 py-2 text-white bg-green-500 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                      onClick={() => handleClick(row.id)}
                      disabled={row.status !== OrderStatus.COURIER_SELECTED}
                    >
                      Отдать курьеру
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Тут пока нет заказов. Вернитесь чуть позже.</p>
      )}
    </div>
  );
};
