import React, { useEffect } from "react";
import { createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
};

type RoleState = {
  role: "USER" | "COURIER" | "GOVERNMENT";
  user: Record<string, string>;
  token: string;
  loaded: boolean;
};

export const RoleContext = createContext<{
  state: RoleState;
  setRoleState: (newState: RoleState) => void;
}>({
  state: { role: "USER", user: {}, token: "", loaded: false },
  setRoleState: () => null,
});

export const useProviderContext = () => {
  return useContext(RoleContext);
};

export const RoleProvider: React.FC<Props> = ({ children }) => {
  const [roleState, setRoleState] = React.useState<RoleState>({
    role: "USER",
    user: {},
    token: "",
    loaded: false,
  });

  useEffect(() => {
    const lastRole = localStorage.getItem("lastRole");
    if (lastRole) {
      setRoleState({ ...JSON.parse(lastRole), loaded: true });
    } else setRoleState((roleState) => ({ ...roleState, loaded: true }));
  }, []);

  return (
    <RoleContext.Provider value={{ state: roleState, setRoleState }}>
      {children}
    </RoleContext.Provider>
  );
};
