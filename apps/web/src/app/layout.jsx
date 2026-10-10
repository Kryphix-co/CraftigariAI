import { Plus_Jakarta_Sans } from "next/font/google";
import { LanguageProvider } from "@/features/i18n/LanguageContext";
import { RouteLanguageFallback } from "@/features/i18n/RouteLanguageFallback";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
 variable: "--font-plus-jakarta-sans",
 subsets: ["latin"],
});

export const metadata = {
 title: "Craftigari",
 description: "Craftigari AI Artisan App",
};

export default function RootLayout({ children }) {
 return (
 <html
  lang="hi"
  className={`${plusJakartaSans.variable} h-full antialiased`}
 >
  <head>
  <link
   href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
   rel="stylesheet"
  />
  </head>
  <body className="min-h-full flex flex-col font-body selection:bg-surface-container-high">
    <LanguageProvider>
     {children}
     <RouteLanguageFallback />
    </LanguageProvider>
  </body>
 </html>
 );
}
