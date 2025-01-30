import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { userModel } from "./models/users";
import { dbConnect } from "./services/mongoDB";
import mongoClientPromise from "./services/monoClientPromise";
import { sendGreetMail } from "./utils/serverActions";

// Types for account and user
interface GoogleAccount {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
    expires_at: number;
    provider: string;
    type: string;
    providerAccountId: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    emailVerified: string | null;
}

// Updated token interface using the above types
interface MyToken {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    user: User;
    error?: string;
}
interface RefreshedTokens {
    access_token: string;
    expires_in: number;
    refresh_token: string;
}
interface MySession {
    user: User;
    accessToken: string;
    error?: string;
}

// Helper function to check if the token is valid
function isTokenValid(token: MyToken): boolean {
    return Date.now() < ( token.accessTokenExpires || 0 );
}

// Function to refresh the access token
async function refreshAccessToken(token: MyToken): Promise<MyToken> {
    // console.log("refresh token function", token);
    try {
        const url = token?.user?.password ? (
            `${ process.env.NEXT_PUBLIC_URL }/api/auth/token`
        ) : (
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
                client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET_ID!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }).toString()
        );

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: token?.user?.password ? JSON.stringify({ email: token.user.email }) : undefined,
        });

        const refreshedTokens: RefreshedTokens = await response.json();

        // console.log( "response data: ", refreshedTokens );
        if (!response.ok) {
            // If unauthorized, clear credentials
            if (response.status === 401) {
                await signOut({ callbackUrl: `${ process.env.NEXT_PUBLIC_URL }` });
            }
            throw new Error("Refresh failed");
        }
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens?.refresh_token || refreshedTokens.access_token,
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        
        return {
            ...token,
            error: "RefreshAccessTokenError"
        };
    }
}

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth( {
    adapter: MongoDBAdapter( mongoClientPromise, { databaseName: "airbnb" } ),
    secret: process.env.AUTH_SECRET,
    ...authConfig,
    providers: [
        CredentialsProvider( {
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize ( credentials )
            {
                await dbConnect();
                if ( !credentials ) return null;

                console.log( "Authorize credentials:", credentials );
                const user = await userModel.findOne( { email: credentials.email } );

                if ( !user )
                {
                    console.error( "User not found:", credentials.email );
                    throw new Error( "User not found" );
                }

                if ( typeof user.password === "string" && typeof credentials.password === "string" )
                {
                    const isMatch = await bcrypt.compare( credentials.password, user.password );

                    if ( isMatch )
                    {
                        console.log( "Password match successful for user:", user.email );
                        return user;
                    } else
                    {
                        console.error( "Invalid credentials for user:", user.email, user.password, credentials.password );
                        throw new Error( "Invalid credentials" );
                    }
                }

                console.error( "Password or credentials are not strings" );
                return null;
            },
        } ),
        GoogleProvider( {
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET_ID!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            allowDangerousEmailAccountLinking: true,
        } ),
    ],
    callbacks: {
        async jwt ( { token, user, account }: { token: MyToken; user?: User; account?: GoogleAccount } ): Promise<MyToken>
        {
            // const existingUser = await userModel.findOne({ email: user.email });

            // if (!existingUser) {
            //     await userModel.create(user); 
            //     await sendGreetMail(user.email, user.name);
            // }

            if ( account && user )
            {
                return {
                    accessToken: account.access_token,
                    accessTokenExpires: Date.now() + ( account.expires_in || 0 ) * 1000,
                    refreshToken: account.refresh_token,
                    user,
                };
            }

            if ( isTokenValid( token ) )
            {
                // console.log( "old token", token );
                return token;
            }
            // console.log( "going to refresh token:--->>>>", token );
            try
            {
                const refreshedToken = await refreshAccessToken( token );
                return refreshedToken;
            } catch ( error )
            {
                console.error( "Error refreshing token:", error );
                // Clear token and force logout
                return null;
            }
        },
        async session ( { session, token }: { session: MySession; token: MyToken } ): Promise<MySession>
        {
            // Invalidate session if no valid token
            if ( !token )
            {
                session.user = null;
                session.accessToken = "";
                session.error = "TokenRevoked";
                return session;
            }

            session.user = token.user;
            session.accessToken = token.accessToken;
            session.error = token.error;

            // console.log( "sessions auth--->>>>", session );
            return session;
        },
    },
    events: {
        async signIn ( { user, account } )
        {
            try
            {
                await dbConnect();
        
                if ( user?.email )
                {
                    const dbUser = await userModel.findOne( { email: user.email } );
        
                    if (!dbUser && account?.provider !== 'credentials') {
                        const newUser = await userModel.create( {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            emailVerified: true,
                            firstLogin: false
                        } );
                        await sendGreetMail(newUser.email, newUser.name);
                        return;
                    };

                    const updates: Record<string, never> = {};

                    if ( account?.provider !== 'credentials' )
                    {
                        updates.emailVerified = true;
                    }

                    if ( dbUser.firstLogin )
                    {
                        await sendGreetMail( user?.email, user?.name );
                        updates.firstLogin = false;
                    }

                    if ( Object.keys( updates ).length > 0 )
                    {
                        await userModel.updateOne(
                            { _id: dbUser._id },
                            { $set: updates }
                        );
                    }
                }
            }
            catch ( error )
            {
                console.error( "Error handling signIn event:", error );
            }
        }
    },
} );