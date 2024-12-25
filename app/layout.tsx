import { kanit, playfairDisplay, rubik, ubuntu } from "@/components/fonts/font";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbnb || Home",
  description: "Generated by github.com/muhamash ; Instructed by LWS(learn with sumit)",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ kanit.className } ${ playfairDisplay.className } ${rubik.className} ${ubuntu.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};
