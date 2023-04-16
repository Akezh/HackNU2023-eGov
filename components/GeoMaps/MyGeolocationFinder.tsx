import { GeolocationControl, Map, YMaps } from "@pbe/react-yandex-maps";
import React, { useEffect, useState } from "react";

export const MyGeolocationFinder = () => {
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);

        const apiUrl =
          "https://geocode-maps.yandex.ru/1.x/?format=json&apikey=25425f6d-bb09-4bcd-939d-0971f02f567e&geocode=${longitude},${latitude}";
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const address =
              data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
            console.log(address);
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
          });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <YMaps query={{ apikey: "25425f6d-bb09-4bcd-939d-0971f02f567e" }}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultState={{ center, zoom: 15 }}
      >
        <GeolocationControl options={{ float: "right" }} />
      </Map>
    </YMaps>
  );
};
