import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocabii",
  description: "Expand your vocabulary effortlessly with Vocabii.",
  openGraph: {
    title: "Vocabii",
    description: "Expand your vocabulary effortlessly with Vocabii.",
    url: "https://vocabii.com",
    type: "website",
    images: [
      {
        url: "https://vocabii.com/icon.ico",
        width: 208,
        height: 208,
        alt: "Vocabii Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content"
        />
      </head>
      <body className={`${inter.className} h-[100dvh] overflow-hidden`}> 
        <div className="flex flex-col justify-between w-full h-full">
          <main className="flex-grow w-full h-full overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
