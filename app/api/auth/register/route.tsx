import { userModel } from "@/models/users";
import { dbConnect } from "@/services/mongoDB";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface UserRequestData {
  name: string;
  email: string;
  password: string;
}

export const POST = async ( request: NextRequest ): Promise<NextResponse> =>
{
    const { name, email, password }: UserRequestData = await request.json();

    console.log( name, email, password );

    await dbConnect();

    const hashedPassword = await bcrypt.hash( password, 5 );

    const newUser = {
        name,
        email,
        password: hashedPassword,
    };

    console.log( newUser );

    try
    {
        await userModel.create( newUser );
        return new NextResponse( "User has been created", {
            status: 201,
        } );
    } catch ( err )
    {
        return new NextResponse( err instanceof Error ? err.message : "Internal server error", {
            status: 500,
        } );
    }
};