"use client";

import "./global-styles.css";
import Header from "./header";
import Footer from "./footer";
import React, { useEffect } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <br></br>

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
