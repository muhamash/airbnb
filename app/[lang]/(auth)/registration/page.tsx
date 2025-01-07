import Form from "@/components/auth/Form";
import Image from "next/image";

export default function RegistrationPage() {
  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-cover bg-center">
        <Image
          alt="Login background"
          src="/assets/bgPay.jpg"
          layout="fill"
          objectFit="cover"
          className="filter blur-[2px]"
        />
      </div>
    
      {/* Form */}
      <div className="relative">
        <Form isLogIn={false} />
      </div>
    </div>
  );
}
