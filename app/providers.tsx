"use client";

import { type ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import { store } from "../redux/store";
import { setCredentials } from "../redux/features/authSlice";
import { useGetMeQuery } from "../redux/services/authApi";
import { ThemeProvider } from "../context/ThemeContext";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data } = useGetMeQuery();

  useEffect(() => {
    if (data?.user) dispatch(setCredentials(data));
  }, [data, dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthLoader>{children}</AuthLoader>
      </ThemeProvider>
    </Provider>
  );
}
