import Logo from "@/app/ui/standalone/logo";
import LoginForm from "@/app/ui/authforms/login-form";

export default function LoginPage() {
  return (
    <main
      className="flex items-center justify-center min-h-screen"
      style={{
        background:
          "linear-gradient(150deg, #334491, #344592, #476db8,  #6a9cd7, #c8d2dc,#dac9b9)",
      }}
    >
      <div className="flex flex-col items-center w-full max-w-[400px] p-4 space-y-6">
        <Logo />
        <LoginForm />
      </div>
    </main>
  );
}
