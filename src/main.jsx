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
import FsCalendarPage from "./routes/FsCalendarPage";
import EventsPage from "./routes/EventsPage";

const router = createBrowserRouter([
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
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "fscalendar",
        element: <FsCalendarPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
