import { Session } from "@/models/sessions";
import { userModel } from "@/models/users";
import { dbConnect } from "@/services/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface UserRequestData {
    email: string;
}

export const POST = async ( request: NextRequest ): Promise<NextResponse> =>
{
    const { email }: UserRequestData = await request.json();

    try
    {
        await dbConnect();

        const user = await userModel.findOne( { email } );

        if ( !user )
        {
            return new NextResponse( "User not found", {
                status: 404,
            } );
        }

        let session = await Session.findOne( { userId: user._id } );

        if ( session )
        {
            // Check if the session has expired
            if ( new Date( session.expires ) < new Date() )
            {
                await Session.deleteOne( { _id: session._id } );

                const newSessionToken = uuidv4();
                const newRefreshToken = `${ uuidv4() }-${ new Date().toISOString() }`;
                const newExpires = new Date( Date.now() + 1 * 60 * 1000 );

                session = await Session.create( {
                    sessionToken: newSessionToken,
                    userId: user._id,
                    expires: newExpires,
                    refreshToken: newRefreshToken,
                } );
            } else if ( !session.refreshToken )
            {
                // Add a refreshToken if it's missing
                session.refreshToken = `${ uuidv4() }-${ new Date().toISOString() }`;
                await session.save();
            }
        } else
        {
            const newSessionToken = uuidv4();
            const newRefreshToken = `${ uuidv4() }-${ new Date().toISOString() }`;
            const newExpires = new Date( Date.now() + 1 * 60 * 1000 );

            session = await Session.create( {
                sessionToken: newSessionToken,
                userId: user._id,
                expires: newExpires,
                refreshToken: newRefreshToken,
            } );
        }

        return new NextResponse(
            JSON.stringify( {
                access_token: session.sessionToken,
                expires_in: session.expires,
                refresh_token: session.refreshToken,
            } ),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch ( err )
    {
        return new NextResponse(
            err instanceof Error ? err.message : "Internal server error",
            {
                status: 500,
            }
        );
    }
};