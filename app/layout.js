import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "The Detailing Mafia | Choose Your Experience",
  description: "The Detailing Mafia — Premium car care. Choose your experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
