import { baseApi } from "./baseApi";

export interface Address {
  id: number;
  user_id: number;
  receiver_name: string;
  phone_number: string;
  house_number: string;
  building_name?: string;
  floor?: string;
  landmark?: string;
  formatted_address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  label: "Home" | "Work" | "Other" | string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressPayload {
  receiver_name: string;
  phone_number: string;
  house_number: string;
  building_name?: string;
  floor?: string;
  landmark?: string;
  formatted_address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  label?: string;
  is_default?: boolean;
}

export interface AddressResponse<T = Address[]> {
  success: boolean;
  message?: string;
  data: T;
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAddresses: build.query<AddressResponse<Address[]>, void>({
      query: () => "/addresses",
      providesTags: ["Address"],
    }),
    createAddress: build.mutation<AddressResponse<Address>, CreateAddressPayload>({
      query: (body) => ({
        url: "/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: build.mutation<AddressResponse<Address>, { id: number; data: Partial<CreateAddressPayload> }>({
      query: ({ id, data }) => ({
        url: `/addresses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: build.mutation<AddressResponse<void>, number>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: build.mutation<AddressResponse<void>, number>({
      query: (id) => ({
        url: `/addresses/${id}/default`,
        method: "PUT",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;
