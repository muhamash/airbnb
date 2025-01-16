import { fetchBookingDetails, fetchDictionary } from '@/utils/fetchFunction';
import { generateHtml } from '@/utils/utils';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import QRCode from 'qrcode';

export async function POST ( request: Request ): Promise<Response>
{
    try
    {
        const url = new URL( request.url );
        const bookingId: string | null = url.searchParams.get( "bookingId" );
        const hotelId: string | null = url.searchParams.get( "hotelId" );
        const lang: string | null = url.searchParams.get( "lang" );

        if ( !bookingId || !hotelId || !lang )
        {
            return new Response( "Missing required parameters.", { status: 400 } );
        }

        const [ bookingDetails, language ] = await Promise.all( [
            fetchBookingDetails( hotelId, bookingId ),
            fetchDictionary( lang ),
        ] );
        
        const qrCodeData = await QRCode.toDataURL(
            `${ process.env.NEXT_PUBLIC_URL }/${ lang }/redirect?bookingId=${ bookingId }&hotelName=${ bookingDetails?.hotelName }&name=${ bookingDetails?.name }&hotelAddress=${ bookingDetails?.hotelAddress }&target=${ process.env.NEXT_PUBLIC_URL }/${ lang }/trip?bookingId=${ bookingId }&hotelId=${ hotelId }`
        );
        const content = await generateHtml( bookingDetails, language, qrCodeData );

        // chromium.setHeadlessMode = process.env.IS_LOCAL ? false : true;
        await chromium.font(
            "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
        );

        const executablePath = await chromium.executablePath();
        if ( !executablePath )
        {
            throw new Error( "Chromium executable not found. Ensure @sparticuz/chromium-min is installed correctly." );
        };

        async function getBrowser ()
        {
            return puppeteer.launch( {
                args: process.env.IS_LOCAL ? puppeteer.defaultArgs() : chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: process.env.IS_LOCAL
                    ? "/tmp/localChromium/chromium/mac_arm-1407503/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
                    : await chromium.executablePath(),
                headless: process.env.IS_LOCAL ? false : chromium.headless,
            } );
        }
        // console.log( content );
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.setContent( content, { waitUntil: "networkidle0" } );
        
        const pdfBuffer = await page.pdf( {
            format: "A4",
            printBackground: true,
        } );
        console.log( 'Browser launched' );
        
        await browser.close();

        return new Response( pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="BookingConfirmation.pdf"',
            },
            status: 200,
        } );

    } catch ( error )
    {
        console.error( 'Failed to generate PDF:', error );
        return new Response(
            JSON.stringify( {
                status: 500,
                success: false,
                message: 'Failed to generate PDF.',
            } ),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    };
}