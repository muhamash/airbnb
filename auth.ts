import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { userModel } from "./models/users";
import mongoClientPromise from "./services/monoClientPromise";

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
    return Date.now() < (token.accessTokenExpires || 0);
}

// Function to refresh the access token
async function refreshAccessToken(token: MyToken): Promise<MyToken> {
    // console.log("refresh token function", token);
    try {
        const url = token?.user?.password ? (
            `http://localhost:3000/api/auth/token`
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

        console.log( "response data: ", refreshedTokens );
        
        if (!response.ok) {
            throw refreshedTokens;
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
    secret: process.env.NEXTAUTH_SECRET!,
    ...authConfig,
    providers: [
        CredentialsProvider( {
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize ( credentials )
            {
                if ( !credentials ) return null;

                const user = await userModel.findOne( { email: credentials.email } );

                if ( !user )
                {
                    throw new Error( "User not found" );
                }

                if ( typeof user.password === 'string' && typeof credentials.password === 'string' )
                {
                    const isMatch = await bcrypt.compare( credentials.password, user.password );

                    if ( isMatch )
                    {
                        return user;
                    } else
                    {
                        throw new Error( "Invalid credentials" );
                    }
                }

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
        } ),
    ],
    callbacks: {
        async jwt ( { token, user, account }: { token: MyToken; user?: User; account?: GoogleAccount } ): Promise<MyToken>
        {
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
            return refreshAccessToken( token );
        },
        async session ( { session, token }: { session: MySession; token: MyToken } ): Promise<MySession>
        {
            session.user = token.user;
            session.accessToken = token.accessToken;
            session.error = token.error;

            // console.log( "sessions auth--->>>>", session );
            return session;
        },
    },
} );