import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import mongoClientPromise from "./database/mongoClientPromise";
import { userModel } from "./models/user-model";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth( {
    adapter: MongoDBAdapter( mongoClientPromise, { databaseName: process.env.ENVIRONMENT as string } ),
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider( {
            credentials: {
                email: { label: "Email", type: "text" },
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
                        const isMatch = user.email === credentials.email;
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
                    throw new Error( error.message );
                }
            }
        } ),
        GoogleProvider( {
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET_ID as string,
        } ),
    ],
} as NextAuthOptions );