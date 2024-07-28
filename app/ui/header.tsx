import { SignIn, SignUp } from "./auth-components";

interface HeaderProps {
  appName: string;
}

export default function Header({ appName }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full h-20 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
      <div className="flex items-center space-x-4">
        <h1 className="text-white text-2xl font-bold">{appName}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <SignIn />
        <SignUp />
      </div>
    </header>
  );
}
