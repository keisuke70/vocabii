import Image from "next/image";

export default function AcmeLogo() {
  return (
    <div className="overflow-hidden rounded-lg"> {/* You can adjust the padding value as needed */}
      <Image src="/logoww.png" alt="logo" width={550} height={200} />
    </div>
  );
}
