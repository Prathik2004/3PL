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
        {children}
      </body>
    </html>
  );
}