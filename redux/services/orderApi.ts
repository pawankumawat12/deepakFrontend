import { baseApi } from "./baseApi";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  availability_type: "IN_STOCK" | "MADE_TO_ORDER";
  production_status: "COMPLETED" | "PENDING_PRODUCTION" | "PRODUCED";
  image?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  delivery_address_json?: any;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  tax_amount?: number;
  packaging_fee?: number;
  platform_fee?: number;
  cod_fee?: number;
  distance_km?: number;
  tax_inclusive?: boolean;
  total_amount: number;
  pricing_details_json?: any;
  status: "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  payment_method: string;
  payment_status?: string;
  transaction_id?: string;
  payment_details_json?: any;
  cancel_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  addressId?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  deliveryAddressJson?: any;
  paymentMethod?: string;
  notes?: string;
  offerCode?: string;
  couponCode?: string;
}

export interface OrderResponse<T = Order> {
  success: boolean;
  message?: string;
  data: T;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<OrderResponse<Order[]>, void>({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    getOrderDetails: build.query<OrderResponse<Order>, string | number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Order", id }],
    }),
    createOrder: build.mutation<OrderResponse<Order>, CreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart", "Product"],
    }),
    cancelOrder: build.mutation<
      OrderResponse<Order>,
      { orderId: number; cancelReason: string }
    >({
      query: ({ orderId, cancelReason }) => ({
        url: `/orders/${orderId}/cancel`,
        method: "POST",
        body: { cancelReason },
      }),
      invalidatesTags: ["Order", "Product"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = orderApi;

