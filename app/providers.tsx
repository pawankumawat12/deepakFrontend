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
import StoreStatusListener from "../components/StoreStatusListener";
import { updateSocketToken } from "../lib/socket";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { data, isError, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (accessToken) {
      updateSocketToken(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    // Only logout if an active authenticated session fails verification.
    // Never trigger logout for guests or during active login transitions.
    if (isError && !isLoading && (user || accessToken)) {
      dispatch(logout());
    }
  }, [isError, isLoading, user, accessToken, dispatch]);

  const isBlocked = Boolean(
    user && (user.is_blocked || user.is_active === false)
  );

  // If customer is blocked, render ONLY the BlockedAccountScreen and deny access to all pages
  if (isBlocked) {
    return <BlockedAccountScreen />;
  }

  return (
    <>
      <StoreStatusListener />
      {children}
    </>
  );
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
