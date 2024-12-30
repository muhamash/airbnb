import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { userModel } from "./models/users";
import mongoClientPromise from "./services/monoClientPromise";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth( {
    adapter: MongoDBAdapter( mongoClientPromise, { databaseName: "airbnb" as string } ),
    secret: process.env.NEXTAUTH_SECRET,
    // session: {
    //     strategy: 'jwt',
    // },
    ...authConfig,
    providers: [
        CredentialsProvider( {
            credentials: {
                email: { label : "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize ( credentials )
            {
                if ( !credentials ) return null;

                try
                {
                    const user = await userModel.findOne( { email: credentials.email } );
                    console.log( { user } );
                    if ( user )
                    {
                        const password = credentials.password as string;
                        const userPassword = user.password as string;

                        const isMatch = await bcrypt.compare( password, userPassword );
                        
                        if ( isMatch )
                        {
                            return user;
                        } else
                        {
                            throw new Error( 'Email or password mismatch' );
                        }
                    } else
                    {
                        throw new Error( 'User not found' );
                    }
                } catch ( error: unknown )
                {
                    throw error;
                }
            }
        } ),
        GoogleProvider( {
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET_ID as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        } ),
    ],
    // trustHost: process.env.NODE_ENV === "development",
} );