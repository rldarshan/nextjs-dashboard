"use client";
import Head from 'next/head';
import "./styles/global_styles.scss";
import { AuthProvider } from "./auth_context";
import favicon from "./assets/react-firebase-favicon.png";
import Script from "next/script";

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
        <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.GOOGLE_ADSENSE_ID}`}
        crossOrigin="anonymous"
      />
      </body>
    </html>
  );
}
