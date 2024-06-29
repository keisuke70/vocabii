import UserButton from "./user-button";

export default function Header() {
  return (
    <header className="flex justify-end border-b h-16 px-5">
      <UserButton />
    </header>
  );
}
