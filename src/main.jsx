import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./ErrorPage";
import HomePage from "./routes/HomePage";
import ClassesPage from "./routes/ClassesPage";
import DonationPage from "./routes/DonationPage";
import LivePage from "./routes/LivePage";
import RegisterPage from "./routes/RegisterPage";
import HistoryPage from "./routes/HistoryPage";
import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "classes",
          element: <ClassesPage />,
        },
        {
          path: "donate",
          element: <DonationPage />,
        },
        {
          path: "live",
          element: <LivePage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "history",
          element: <HistoryPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL ?? "",
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
