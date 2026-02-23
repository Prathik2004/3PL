import { Inter } from "next/font/google";
import "./globals.css";
 
export const metadata = {
  title: "Walkwel 3PL Control Lite",
  description: "Operations Visibility and Exception Monitoring",
};

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white antialiased`}>
        {/* This is now a clean entry point. 
          The flex-layout logic can be handled inside specific (page).tsx 
          or a group layout to keep this file lean.
        */}
        {children}
      </body>
    </html>
  );
}