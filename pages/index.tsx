import { CourierUI, GovUI } from "components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useProviderContext } from "providers";
import { useEffect } from "react";
import { api } from "utils";

const Home: NextPage = () => {
  const router = useRouter();
  const context = useProviderContext();

  useEffect(() => {
    if (context.state.role === "USER" && context.state.loaded) {
      router.push("/order");
    }
  }, [router, context]);

  useEffect(() => {
    api.defaults.headers.common["Authorization"] = `JWT ${context.state.token}`;
  }, [context]);

  if (context.state.role === "USER") {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl">
      {context.state.role === "COURIER" && <CourierUI />}
      {context.state.role === "GOVERNMENT" && <GovUI />}
    </div>
  );
};

export default Home;
