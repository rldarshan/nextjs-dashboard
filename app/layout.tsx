"use client";

import "./styles/global_styles.css";
import { AuthProvider } from "./auth_context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" type="image/png" sizes="32x32" href="./assets/react-firebase-favicon.png" />
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
