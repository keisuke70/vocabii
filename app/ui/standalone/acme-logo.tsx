import Image from "next/image";

export default function AcmeLogo() {
  return (
    <div className="overflow-hidden rounded-lg">
      <Image src="/logoww.png" alt="logo" width={250} height={200} />
    </div>
  );
}
