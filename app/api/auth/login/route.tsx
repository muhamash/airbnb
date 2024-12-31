import { Session } from "@/models/sessions";
import { userModel } from "@/models/users";
import { dbConnect } from "@/services/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface UserRequestData {
    email: string;
    password: string;
}

export const POST = async ( request: NextRequest ): Promise<NextResponse> =>
{
    const { email, password }: UserRequestData = await request.json();
    console.log( "Requested from:", email, password );

    try
    {
        // Connect to the database
        await dbConnect();

        // Find the user by email
        const user = await userModel.findOne( { email: email } );

        if ( !user )
        {
            return new NextResponse( "User not found", {
                status: 404,
            } );
        }

        console.log( "User found:", user );

        // Retrieve the current session for the user
        let session = await Session.findOne( { userId: user._id } );

        if ( session )
        {
            // Check if the session is expired
            if ( new Date( session.expires ) < new Date() )
            {
                console.log( "Session expired, creating a new one..." );

                // Remove the expired session
                await Session.deleteOne( { _id: session._id } );

                // Generate a new session
                const newSessionToken = uuidv4();
                const newExpires = new Date( Date.now() + 1 * 60 * 1000 );

                session = await Session.create( {
                    sessionToken: newSessionToken,
                    userId: user._id,
                    expires: newExpires,
                } );

                console.log( "New session created:", session );
            } else
            {
                console.log( "Session is still valid:", session );
            }
        } else
        {
            console.log( "No existing session, creating a new one..." );

            // Generate a new session if none exists
            const newSessionToken = uuidv4();
            const newExpires = new Date( Date.now() + 1 * 60 * 1000 );

            session = await Session.create( {
                sessionToken: newSessionToken,
                userId: user._id,
                expires: newExpires,
            } );

            console.log( "New session created:", session );
        }

        // Return the session token and expiration
        return new NextResponse(
            JSON.stringify( { token: session.sessionToken, expires: session.expires } ),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch ( err )
    {
        console.error( "Error:", err );
        return new NextResponse( err instanceof Error ? err.message : "Internal server error", {
            status: 500,
        } );
    }
};