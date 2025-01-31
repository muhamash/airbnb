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
    firstLogin: boolean;
    phoneNumber: string;
};

const userSchema: Schema<IUser> = new Schema( {
    name: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: false, 
        type: String,
        match: /^[0-9]{10}$/,
        unique: false
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: false,
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
    firstLogin: {
        type: Boolean,
        default: true
    },
    verificationToken: { type: String, default: null },
    tokenExpiration: { type: Date, default: null },
} );

export const userModel: Model<IUser> =
    mongoose?.models?.users || mongoose.model<IUser>( "users", userSchema );