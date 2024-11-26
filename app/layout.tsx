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
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <style>
          {`
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
              background: linear-gradient(150deg, #334491, #344592, #476db8, #6a9cd7, #c8d2dc, #dac9b9);
              background-attachment: fixed;
              overflow-x: hidden;
            }
          `}
        </style>
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
