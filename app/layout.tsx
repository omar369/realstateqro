import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import {cn} from '@/lib/utils'

import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

//FUENTES
const monse = Montserrat({
  weight: '400',
  subsets: ['latin'],
})


export const metadata: Metadata = {
  title: "Realstate Querétaro",
  description: "App inmobiliaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${monse.className} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen container mx-auto px-4">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
