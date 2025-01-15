/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchBookingDetails, fetchDictionary } from '@/utils/fetchFunction';
import { generateHtml } from '@/utils/utils';
import { chromium } from 'playwright';
import QRCode from 'qrcode';

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const bookingId: string | null = url.searchParams.get("bookingId");
        const hotelId: string | null = url.searchParams.get("hotelId");
        const lang: string | null = url.searchParams.get("lang");

        if (!bookingId || !hotelId || !lang) {
            return new Response("Missing required parameters.", { status: 400 });
        }

        const [bookingDetails, language] = await Promise.all([
            fetchBookingDetails(hotelId, bookingId),
            fetchDictionary(lang),
        ]);

        const qrCodeData = await QRCode.toDataURL(
            `${process.env.NEXT_PUBLIC_URL}/bn/redirect?bookingId=${bookingId}&hotelName=${bookingDetails?.hotelName}&name=${bookingDetails?.name}&hotelAddress=${bookingDetails?.hotelAddress}&target=${process.env.NEXT_PUBLIC_URL}/${lang}/trip?bookingId=${bookingId}&hotelId=${hotelId}`
        );

        const browser = await chromium.launch({
            headless: true, // Run in headless mode for serverless environments
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        // Generate HTML content
        const content = await generateHtml(bookingDetails, language, qrCodeData);

        // Load the content into the page
        await page.setContent(content);

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        // Close the browser
        await browser.close();

        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="BookingConfirmation.pdf"',
            },
        });
    } catch (error) {
        console.error('Failed to generate PDF:', error);

        return new Response(
            JSON.stringify({
                success: false,
                message: 'Failed to generate PDF.',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};