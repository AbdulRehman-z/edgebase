import Image from "next/image";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-svh relative flex-col items-center justify-center gap-6 p-6 md:p-7">
      <div className="flex items-center gap-x-2 absolute top-10 left-10">
        <Image src="/logo.svg" alt="Logo" width={25} height={25} />
        <h1 className="text-2xl font-bold">Edgebase</h1>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
