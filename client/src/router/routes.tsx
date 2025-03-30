import React from "react";
import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import EventDemonstration from "../pages/EventDemonstration.page";
import WebsocketDemonstration from "../pages/WebsocketDemonstration.page";

// Define route type
interface RouteItem {
  path: string;
  element: React.ComponentType;
  exact?: boolean;
  children?: RouteItem[];
}

const routes: RouteItem[] = [
  {
    path: "/",
    element: Home,
    exact: true,
  },
  {
    path: "/about",
    element: About,
  },
  {
    path: "/event-demonstration",
    exact: true,
    element: EventDemonstration,
  },
  {
    path: "/websocket-demonstration",
    exact: true,
    element: WebsocketDemonstration,
  },
  {
    path: "*",
    element: NotFound,
  },
];

export default routes;
