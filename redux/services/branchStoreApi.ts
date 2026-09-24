import { baseApi } from "./baseApi";

export interface ResolvedStoreInfo {
  id: number | null;
  name: string;
  is_main_admin?: boolean;
  latitude?: number;
  longitude?: number;
  max_delivery_distance?: number | null;
  distanceKm?: number | null;
}

export interface ResolveStoreResponse {
  success: boolean;
  store: ResolvedStoreInfo;
  storeType: "branch" | "admin";
  distanceKm?: number | null;
  message?: string;
  can_deliver?: boolean;
  outOfDeliveryZone?: boolean;
}

export const branchStoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    resolveStoreByLocation: build.query<
      ResolveStoreResponse,
      { lat: number; lng: number }
    >({
      query: ({ lat, lng }) => ({
        url: "/stores/resolve-by-location",
        params: { lat, lng },
      }),
    }),
  }),
});

export const {
  useResolveStoreByLocationQuery,
  useLazyResolveStoreByLocationQuery,
} = branchStoreApi;
