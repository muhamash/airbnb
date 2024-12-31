import mongoose, { Document, Model, Schema } from "mongoose";

export interface SessionsScheme extends Document {
  sessionToken: string;
  userId: mongoose.Schema.Types.ObjectId;
  expires: Date;
  refreshToken: string;
}

const sessionSchema: Schema<SessionsScheme> = new Schema( {
  sessionToken: { type: String, required: true },
  refreshToken: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  expires: { type: Date, required: true, expires: 0 }
} );

export const Session: Model<SessionsScheme> =
  mongoose.models.sessions || mongoose.model<SessionsScheme>( "sessions", sessionSchema );