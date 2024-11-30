"use client";
import Head from 'next/head';
import "./styles/global_styles.css";
import { AuthProvider } from "./auth_context";
import favicon from "./assets/react-firebase-favicon.png";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
      <link rel="icon" type="image/png" sizes="32x32" href={favicon.src} />
        <title>Darshan App</title>
      </Head>
      
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
