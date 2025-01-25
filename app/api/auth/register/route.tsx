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
    try
    {
        const { name, email, password }: UserRequestData = await request.json();

        if ( !name || !email || !password )
        {
            return NextResponse.json(
                { message: "Name, email, and password are required." },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await userModel.findOne( { email } );
        if ( existingUser )
        {
            return NextResponse.json(
                { message: "User already exists. Please login or use a different email." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash( password, 10 );

        const newUser = await userModel.create( {
            name,
            email,
            password: hashedPassword,
        } );

        return NextResponse.json(
            { message: "User has been created successfully.", userId: newUser._id },
            { status: 201 }
        );
    } catch ( err )
    {
        console.error( "Error creating user:", err );
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Internal server error" },
            { status: 500 }
        );
    }
};