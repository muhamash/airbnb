import Footer from "@/components/common/Footer";
import Nav from "@/components/common/Nav";
import { dbConnect } from "@/services/mongoDB";
import type { Metadata } from "next";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Airbnb || Home",
  description: "Generated by github.com/muhamash ; Instructed by LWS(learn with sumit)",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}> )
{
  // console.log(params)
  await dbConnect();
  // console.log(connection.name)
  
  return (
    <>
      <Nav params={params} />
      {children}
      <Footer params={params} />
    </>
  );
};
