import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStock extends Document {
  hotelId: mongoose.Types.ObjectId;
  personMax: number;
  roomMax: number;
  bedMax: number;
}

const StockSchema: Schema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    personMax: {
      type: Number,
      required: true,
    },
    roomMax: {
      type: Number,
      required: true,
    },
    bedMax: {
      type: Number,
      required: true,
    },
  },
//   { timestamps: true }
);

export const stockModel: Model<IStock> = mongoose.models.stocks || mongoose.model<IStock>("stocks", StockSchema);