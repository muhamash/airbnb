import mongoose, { Document, Model, Schema } from "mongoose";

interface OwnerInfo
{
    ownerId: string;
    ownerImage: string;
    ownerName: string;
    ownerEmail: string;
}

export interface IHotel extends Document
{
  id: string;
  name?: string;
  address?: string;
  airportCode?: string;
  city?: string;
  countryCode?: string;
  rate?: number;
  propertyCategory?: number;
  stateProvinceCode?: string;
  thumbNailUrl?: string;
  gallery?: string[];
  overview?: string;
    amenities?: string[];
    ownerInfo?: OwnerInfo;
};

const ownerInfoSchema = new Schema( {
    ownerId: { type: String, required: true },
    ownerImage: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true }
} );

const hotelSchema: Schema<IHotel> = new Schema( {
    name: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },
    airportCode: {
        required: true,
        type: String
    },
    city: {
        required: false,
        type: String
    },
    countryCode: {
        required: false,
        type: String
    },
    rate: {
        required: true,
        type: Number
    },
    propertyCategory: {
        required: false,
        type: Number
    },
    stateProvinceCode: {
        required: false,
        type: String
    },
    thumbNailUrl: {
        required: true,
        type: String
    },
    gallery: {
        required: false,
        type: [ String ]
    },
    overview: {
        required: false,
        type: String
    },
    amenities: {
        required: false,
        type: [ String ]
    },
    ownerInfo: ownerInfoSchema
} );

hotelSchema.index({ name: 1 });

export const hotelModel: Model<IHotel> = mongoose.models.hotels || mongoose.model<IHotel>( "hotels", hotelSchema );