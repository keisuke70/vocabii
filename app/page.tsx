import Header from "@/components/header";
import Image from "next/image";

export default function Home() {
  const appName = "Vocabii"; 

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-purple-500 to-blue-500 text-white">
      <Header appName={appName} />
      <div className="flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold">{appName}で英単語の意味と例文を自動生成</h1>
        <h4 className="text-2xl font-bold">覚えたい単語を覚えるために本当に必要な機能だけ</h4>
        <p className="mt-4 text-center">
          覚えたい単語を入力すると、自動的に意味と例文が作成されます。ユーザーは自分の発音を追加することができます。
        </p>
        <p className="mt-4 text-center">
          パソコンはもちろんスマートフォンやタブレット端末など、様々なデバイスから利用できます。単語帳を持ち運ぶ必要がないので、外出先や通勤・通学時でも手軽に暗記できます。
        </p>

        <div className="mt-10 flex">
          <Image src="/toppage.jpeg" width={800} height={500} alt="App screenshot 2" className="w-40 h-auto mx-2" />
        </div>
      </div>
    </main>
  );
}
