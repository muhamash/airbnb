import { auth } from "@/auth";
import Create from "@/components/create/old";
import { FormProvider } from "@/utils/FormContext";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function CreatePage ()
{
  const session: Session = await auth();
  // const formattedDate = new Date(session.expires).toLocaleString();
  // console.log( session );
  const userId = session?.user?.id ?? session?.user?._id;

  if ( !session?.user?.emailVerified )
  {
    redirect( "/verify" );
  }

  if ( !userId )
  {
    redirect( "/login" );  
  }

  return (
    <FormProvider>
      <Create user={session?.user}/>
    </FormProvider>
  )
}