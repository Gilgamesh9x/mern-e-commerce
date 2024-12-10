import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/https";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import OrderListPage from "./pages/admin/OrderListPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductEditPage from "./pages/admin/ProductEditPage";

import PrivateRoute from "./components/PirvateRoute";
import AdminRoute from "./components/AdminRoute";
import UserListPage from "./pages/admin/UserListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/page/:page",
        element: <HomePage />,
      },
      {
        path: "/search/:searchTerm",
        element: <HomePage />,
      },
      {
        path: "/search/:searchTerm/page/:page",
        element: <HomePage />,
      },
      {
        path: "product/:productId",
        element: <ProductPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        element: <PrivateRoute />, // Protect routes under this wrapper
        children: [
          {
            path: "/shipping",
            element: <ShippingPage />,
          },
          {
            path: "/payment",
            element: <PaymentPage />,
          },
          {
            path: "/placeorder",
            element: <PlaceOrderPage />,
          },
          {
            path: "/order/:orderId",
            element: <OrderPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "/admin/orderslist",
            element: <OrderListPage />,
          },
          {
            path: "/admin/productslist",
            element: <ProductListPage />,
          },
          {
            path: "/admin/productslist/page/:page",
            element: <ProductListPage />,
          },
          {
            path: "/admin/product/:productId/edit",
            element: <ProductEditPage />,
          },
          {
            path: "/admin/userslist",
            element: <UserListPage />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  const initialOptions = {
    "client-id":
      "ATatVqfMJLM9EcNd-jCkfx2n690AqLwWoUWg0-vWobNic-fYgsMwVZ43vN_yzvHvr2hWLr-Vh936umHw",
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />;
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
}
