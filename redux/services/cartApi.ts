import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addCartItem: build.mutation({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: build.mutation({
      query: ({ productId, quantity }) => ({ url: `/cart/items/${productId}`, method: "PATCH", body: { quantity } }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: build.mutation({
      query: (productId) => ({ url: `/cart/items/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: build.mutation({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useGetCartQuery, useAddCartItemMutation, useUpdateCartItemMutation, useDeleteCartItemMutation, useClearCartMutation } = cartApi;
