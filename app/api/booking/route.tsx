/* eslint-disable @typescript-eslint/no-unused-vars */
import { bookingsModel } from "@/models/bookings";
import { getStockByHotelId } from "@/queries";
import { dbConnect } from "@/services/mongoDB";
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
      zipCode
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
      zipCode
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

    const hotelStocks = await getStockByHotelId(hotelId);
    if (!hotelStocks) {
      return NextResponse.json(
        { message: "Hotel stocks not found.", status: 404 },
        { status: 404 }
      );
    }

    if (!hotelStocks.available) {
      return NextResponse.json(
        { message: "No availability for the selected hotel.", status: 400 },
        { status: 400 }
      );
    }

    if (
      (rentType === "rooms" && hotelStocks.roomMax < rentCount) ||
      (rentType === "beds" && hotelStocks.bedMax < rentCount)
    ) {
      return NextResponse.json(
        { message: "Not enough stock available.", status: 400 },
        { status: 400 }
      );
    }

    const bookingDetails = {
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
      const newBooking = bookings.bookings.push(bookingDetails);
      bookingId = bookings.bookings[newBooking - 1]._id;
    } else {
      bookings = new bookingsModel({
        hotelId,
        bookings: [bookingDetails],
      });
      await bookings.save();
      bookingId = bookings.bookings[0]._id;
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