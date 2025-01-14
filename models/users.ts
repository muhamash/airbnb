import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image?: string;
    emailVerified: boolean;
    // verified: boolean;
    verificationToken: string | null;
    tokenExpiration: Date;
};

const userSchema: Schema<IUser> = new Schema( {
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    image: {
        required: false,
        type: String
    },
    // verified: { type: Boolean, default: false },
    emailVerified: {
        default: false,
        type: Boolean,
    },
    verificationToken: { type: String, default: null },
    tokenExpiration: { type: Date, default: null },
} );

export const userModel: Model<IUser> =
    mongoose.models.users || mongoose.model<IUser>( "users", userSchema );