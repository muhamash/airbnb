import { getDictionary } from "@/utils/dictionary";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const locale: string = url.searchParams.get("locale") || "en";
    // console.log('Locale:', locale, url);

    const dictionary = await getDictionary(locale);

    if (!dictionary) {
      return NextResponse.json(
        {
          status: 400,
          success: false,
          message: `Dictionary for locale '${locale}' is not available`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: 'Dictionary fetched successfully',
        data: dictionary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dictionary:', error);

    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: 'Failed to fetch dictionary',
      },
      { status: 500 }
    );
  }
}