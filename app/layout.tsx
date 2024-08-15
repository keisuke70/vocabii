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
        url: "https://vocabii.com/icon.png",
        width: 500,
        height: 350,
        alt: "Vocabii Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vocabii",
    description: "Expand your vocabulary effortlessly with Vocabii.",
    images: ["https://vocabii.com/icon.png"], 
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
        <link rel="icon" href="https://vocabii.com/icon.png" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full min-h-screen">
          <main className="flex-grow w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
