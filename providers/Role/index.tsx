import React, { useEffect } from "react";
import { createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
};

type RoleState = "USER" | "COURIER" | "GOVERNMENT";

export const RoleContext = createContext<{
  state: RoleState;
  setRoleState: (newState: RoleState) => void;
}>({
  state: "USER",
  setRoleState: () => null,
});

export const useProviderContext = () => {
  return useContext(RoleContext);
};

export const RoleProvider: React.FC<Props> = ({ children }) => {
  const [roleState, setRoleState] = React.useState<RoleState>("USER");

  useEffect(() => {
    const lastRole = (localStorage.getItem("lastRole") as RoleState) || "USER";
    if (lastRole) setRoleState(lastRole as RoleState);
  }, []);

  return (
    <RoleContext.Provider value={{ state: roleState, setRoleState }}>
      {children}
    </RoleContext.Provider>
  );
};
