import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure you have your tailwind imports here

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cosmolix LMS | Industrial Excellence",
  description: "Multi-tenant Industrial Internship Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2563EB", 
          colorText: "#0F172A", 
          borderRadius: "12px", 
        },
        elements: {
          card: "shadow-xl border border-slate-200",
          formButtonPrimary: "bg-gradient-to-r from-blue-600 to-teal-500 border-none hover:opacity-90 transition-all",
          footerActionLink: "text-blue-600 hover:text-teal-600",
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}