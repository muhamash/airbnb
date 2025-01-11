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
    } = await request.json();

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
      },
    };

      
      console.log( "bookings details body", bookingDetails );
      await dbConnect();

    // Fetch current hotel stocks
      const hotelStocks = await getStockByHotelId( hotelId );
      console.log( hotelStocks, "hotels stocks booking api" );
    if (!hotelStocks) {
        return NextResponse.json(
            { message: "Hotel stocks not found.", status: 404 },
            { status: 404 }
        );
      };

    // Check stock availability
    if (!hotelStocks.available) {
      return NextResponse.json(
        { message: "No availability for the selected hotel.", status: 400 },
        { status: 400 }
      );
    }

    // Validate stock based on rent type
    if (rentType === "rooms" && hotelStocks.roomMax < rentCount) {
        return NextResponse.json(
            { message: "Not enough rooms available.", status: 400 },
            { status: 400 }
        );
      };

    if (rentType === "beds" && hotelStocks.bedMax < rentCount) {
      return NextResponse.json(
        { message: "Not enough beds available.", status: 400 },
        { status: 400 }
      );
    }

    // Fetch or create booking document
    let bookings = await bookingsModel.findOne({ hotelId });
    if (bookings) {
      bookings.bookings.push(bookingDetails);
    } else {
      bookings = new bookingsModel({
        hotelId,
        bookings: [bookingDetails],
      });
    }

    // Decrement stock values
    if (rentType === "rooms") {
      hotelStocks.roomMax -= rentCount;
    } else if (rentType === "beds") {
      hotelStocks.bedMax -= rentCount;

      // Reduce rooms if three beds equal one room
      if (hotelStocks.bedMax % 3 === 0) {
        hotelStocks.roomMax -= 1;
      }
    }

    // Check if stocks are exhausted
    if (hotelStocks.roomMax <= 0 || hotelStocks.bedMax <= 0) {
      hotelStocks.available = false;
    }

    // Save updated stocks and bookings
    await Promise.all([bookings.save(), hotelStocks.save()]);

      return NextResponse.json(
          {
              message: "Successfully booked!",
              data: bookingDetails,
              status: 200,
          },
          { status: 200 }
      );
  }
  catch ( error )
  {
    console.error("Error while posting booking details:", error);
      return NextResponse.json(
          { message: "Error while posting booking details", error },
          { status: 500 }
      );
  }
};