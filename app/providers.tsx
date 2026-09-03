"use client";

import { type ReactNode, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor, RootState } from "../redux/store";
import { setCredentials, logout } from "../redux/features/authSlice";
import { useGetMeQuery } from "../redux/services/authApi";
import { baseApi } from "../redux/services/baseApi";
import { ThemeProvider } from "../context/ThemeContext";
import BlockedAccountScreen from "../components/BlockedAccountScreen";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isError, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // If accessToken is modified or removed via DevTools/storage, revalidate immediately
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue) {
        refetch();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refetch]);

  useEffect(() => {
    if (data?.user) dispatch(setCredentials(data));
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
    }
  }, [isError, dispatch]);

  const isBlocked = Boolean(
    user && (user.is_blocked || user.is_active === false)
  );

  // If customer is blocked, render ONLY the BlockedAccountScreen and deny access to all pages
  if (isBlocked) {
    return <BlockedAccountScreen />;
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AuthLoader>{children}</AuthLoader>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
