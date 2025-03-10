/* eslint-disable @typescript-eslint/no-unused-vars */
import { bookingsModel, IBooking } from "@/models/bookings";
import { IStock } from "@/models/stocks";
import { getStockByHotelId } from "@/queries";
import { dbConnect } from "@/services/mongoDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<Response> {
  try {
    const {
      rate,
      total,
      name,
      email,
      checkOut,
      checkIn,
      rentType,
      rentCount,
      hotelId,
      lang,
      userId,
      hotelName,
      hotelAddress,
      cardNumber,
      expiration,
      ccv,
      streetAddress,
      aptSuite,
      city,
      state,
      zipCode,
      thumbnail
    } = await request.json();

    const requiredFields = {
      rate,
      total,
      name,
      email,
      checkOut,
      checkIn,
      rentType,
      rentCount,
      hotelId,
      lang,
      userId,
      hotelName,
      hotelAddress,
      cardNumber,
      expiration,
      ccv,
      streetAddress,
      city,
      state,
      zipCode,
      thumbnail
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined || value === null)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Validation failed. Missing required fields.",
          missingFields,
          status: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const hotelStocks = await getStockByHotelId( hotelId );
    const hotelStock : IStock | null = Array.isArray(hotelStocks) ? hotelStocks[0] : hotelStocks;
    if (!hotelStock) {
      return NextResponse.json(
        { message: "Hotel stocks not found.", status: 404 },
        { status: 404 }
      );
    }

    if (!hotelStock?.available as boolean) {
      return NextResponse.json(
        { message: "No availability for the selected hotel.", status: 400 },
        { status: 400 }
      );
    }

    if (
      (rentType === "rooms" && hotelStock.roomMax < rentCount) ||
      (rentType === "beds" && hotelStock.bedMax < rentCount)
    ) {
      return NextResponse.json(
        { message: "Not enough stock available.", status: 400 },
        { status: 400 }
      );
    }

    const bookingDetails = {
      rate,
      name,
      email,
      checkOut,
      checkIn,
      rentType,
      rentCount,
      hotelId,
      lang,
      userId,
      hotelName,
      hotelAddress,
      thumbnail,
      paymentDetails: {
        cardNumber,
        expiration,
        ccv,
        streetAddress,
        aptSuite,
        city,
        state,
        total,
        zipCode
      },
    };

    let bookings = await bookingsModel.findOne({ hotelId });
    let bookingId;

    if (bookings) {
      const newBooking: IBooking = {
        ...bookingDetails,
       _id: new mongoose.Types.ObjectId(),
      };
      bookings?.bookings?.push( newBooking );
      bookingId = newBooking?._id;
    }
    else
    {
      bookings = new bookingsModel( {
        hotelId,
        bookings: [
          {
            ...bookingDetails,
            _id: new mongoose.Types.ObjectId(),
          },
        ],
      } );
      await bookings.save();
      bookingId = bookings.bookings[ 0 ]._id;
    }

    // Update stock availability
    if (rentType === "rooms") {
      hotelStocks.roomMax -= rentCount;
    } else if (rentType === "beds") {
      hotelStocks.bedMax -= rentCount;
      if (hotelStocks.bedMax % 3 === 0) {
        hotelStocks.roomMax -= 1;
      }
    }

    if (hotelStocks.roomMax <= 0 || hotelStocks.bedMax <= 0) {
      hotelStocks.available = false;
    }

    await Promise.all([bookings.save(), hotelStocks.save()]);

    return NextResponse.json(
      {
        message: "Successfully booked!",
        bookingId: bookingId.toString(),
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while posting booking details:", error);
    return NextResponse.json(
      { message: "Error while posting booking details", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 8;

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    // Fetch all bookings and filter by userId
    const allBookings = await bookingsModel.aggregate([
      { $unwind: '$bookings' },
      { $match: { 'bookings.userId': userId } }, 
      { $skip: (page - 1) * limit }, 
      { $limit: limit }, 
    ]);

    const totalCount = await bookingsModel.aggregate([
      { $unwind: '$bookings' },
      { $match: { 'bookings.userId': userId } },
      { $count: 'total' },
    ]);
    
    const total = totalCount[0]?.total || 0;

    return NextResponse.json({
      bookings: allBookings.map(doc => doc.bookings),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      status: 200
    });
  } catch (error) {
    console.error('Error while getting booking details:', error);
    return NextResponse.json(
      { message: 'Error while searching booking details', error: error.message },
      { status: 500 }
    );
  }
}