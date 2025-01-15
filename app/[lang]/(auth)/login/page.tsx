/* eslint-disable @next/next/no-img-element */
import Form from "@/components/auth/Form";

export default async function LoginPage() {
  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-cover bg-center">
        <img
          alt="Login background"
          src="/login.jpeg"
          layout="fill"
          objectFit="cover"
          className="filter blur-[2px]"
        />
      </div>

      {/* Form */}
      <div className="relative">
        <Form isLogIn={true} />
      </div>
    </div>
  );
}