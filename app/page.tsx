import Header from "@/app/ui/standalone/header";
import Image from "next/image";

export default function Home() {
  const appName = "Vocabii";

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-purple-700 via-indigo-600 to-blue-600 text-white">
      <Header appName={appName} />
      <div className="flex flex-col items-center py-16 px-6 md:px-12 lg:px-24">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-center mb-6">
          {appName}で英単語の学習を最適化
        </h1>
        <h4 className="px-3 text-lg md:text-2xl lg:text-3xl font-semibold text-center mb-4">
          英単語を 調べる・記録する を同時に実現
        </h4>
        <p className="mt-4 text-center text-base md:text-xl max-w-3xl leading-relaxed">
          覚えたい単語を入力すると、最新AIの力で例文・発音を含む本当に必要な情報だけを、一括出力
          & 1 clickでオリジナル単語帳に登録。
        </p>

        <div className="mt-12 flex justify-center">
          <Image
            src="/toppage.jpeg"
            width={800}
            height={500}
            alt="App screenshot"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-lg shadow-lg"
          />
        </div>
        <p className="mt-8 text-center text-sm md:text-xl max-w-3xl leading-relaxed">
          パソコンはもちろんスマートフォンやタブレット端末など、様々なデバイスから利用できます。単語帳を持ち運ぶ必要がないので、外出先や通勤・通学時でも手軽に暗記できます。
        </p>
      </div>
    </main>
  );
}
