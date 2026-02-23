import "./globals.css";

export const metadata = {
  title: "Walkwel 3PL Control Lite",
  description: "Operations Visibility and Exception Monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {children}
      </body>
    </html>
  );
}