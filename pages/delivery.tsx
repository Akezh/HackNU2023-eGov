import type { NextPage } from "next";
import { useState } from "react";

import { Table } from "../components";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

type Table = Array<{
  name: string;
  surname: string;
}>;
const Delivery: NextPage = () => {
  const [mock] = useState<Table>([
    { name: "Ar", surname: "Sur" },
    { name: "Br", surname: "Alien" },
  ]);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl">
        <Table columns={["name", "surname"]} data={mock} />
      </div>
      <Footer />
    </>
  );
};

export default Delivery;
