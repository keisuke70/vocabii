import { SignIn } from "./auth-components";

interface HeaderProps {
  appName: string;
}

export default function Header({ appName }: HeaderProps) {
  console.log("App Name: ", appName); 
  return (
    <header className="flex justify-between items-center w-full h-20 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="flex items-center space-x-4">
        <div className="text-white text-2xl font-bold">{appName}</div>
      </div>

      <SignIn />
    </header>
  );
}
