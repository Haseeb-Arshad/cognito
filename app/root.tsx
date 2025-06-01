import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { AnimatePresence } from "framer-motion";

import "./tailwind.css";
import AppLayout from "./components/Layout";
import PageTransition from "./components/animations/PageTransition";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico" },
];

export const meta: MetaFunction = () => [
  { title: "Cognito - Intelligent Monitoring Platform" },
  { name: "description", content: "Advanced entity monitoring and analytics powered by AI" },
  { name: "theme-color", content: "#2C3A47" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition location={location.pathname} key={location.pathname}>
        <Outlet />
      </PageTransition>
    </AnimatePresence>
  );
}
