/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchBookingDetails, fetchDictionary } from '@/utils/fetchFunction';
import { generateHtml } from '@/utils/utils';
import chromium from 'chrome-aws-lambda';
// import puppeteer from 'puppeteer-core';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
// process.env.IS_AWS_LAMBDA ||

export const dynamic = "force-dynamic";
const isServerless =  false; 

export async function POST(request: Request): Promise<Response> {
    try
    {
        const url = new URL(request.url);
        const bookingId : string = url.searchParams.get( "bookingId" );
        const hotelId : string = url.searchParams.get( "hotelId" );
        const lang : string = url.searchParams.get( "lang" );

        // console.log( lang, hotelId, bookingId, url );
        // console.log("URL params:", url.searchParams.toString());

        if (!bookingId || !hotelId || !lang) {
            return new Response("Missing required parameters.", { status: 400 });
        }

        const [ bookingDetails, language ] = await Promise.all( [
            fetchBookingDetails( hotelId, bookingId ),
            fetchDictionary( lang ),
        ] );

        const qrCodeData = await QRCode.toDataURL( `http://localhost:3000/bn/details/67729c78f72778397a3e5627?ratings=3&ratingsLength=2&personMax=10&roomMax=2&bedMax=5&available=true` );
        // console.log( qrCodeData );
        // console.log( "from booking api", bookingDetails );
        if (isServerless) {
            console.log("Running on AWS Lambda");
        } else {
            console.log("Running locally or in another environment");
        };

        const executablePath = isServerless
            ? await chromium.executablePath
            : await puppeteer.executablePath() ;
        if (!executablePath) {
            throw new Error('Chromium not available in this environment.');
        }

        const browser = await puppeteer.launch({
            executablePath,
            args: isServerless ? chromium.args : [],
            headless: isServerless ? chromium.headless : true,
            defaultViewport: isServerless ? chromium.defaultViewport : null,
        });

        // invoice
        const content = await generateHtml( bookingDetails, language, qrCodeData );
        
        try {
            // const content = generateHTML(bookingDetails, language, qrCodeData);
            const page = await browser.newPage();
            await page.setContent(content);
            const pdfBuffer = await page.pdf( { format: 'A4', printBackground: true } );

            return new Response(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="BookingConfirmation.pdf"',
                },
            });
        } finally {
            await browser.close();
        }
    } catch (error) {
        console.error('Failed to generate PDF:', error);

        return new Response(
            JSON.stringify( {
                success: false,
                message: 'Failed to generate PDF.',
            } ),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    };
};