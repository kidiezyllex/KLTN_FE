import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import NextTopLoader from "nextjs-toploader";
import Hero from "@/components/layout/Hero";
import Section from "@/components/layout/Section";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking Hotel",
  description: "Generated by create next app",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <NextTopLoader />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar></NavBar>
              <Hero></Hero>
              <Section></Section>
              <section className="flex flex-grow">
                <Container>{children}</Container>
              </section>
              <Footer></Footer>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
