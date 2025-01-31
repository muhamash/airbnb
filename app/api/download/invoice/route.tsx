import { fetchBookingDetails, fetchDictionary } from '@/utils/fetchFunction';
import { generateHtml } from '@/utils/utils';
import chromium from '@sparticuz/chromium-min';
import { NextResponse } from "next/server";
import puppeteer, { type Browser } from 'puppeteer';
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const isServer = process.env.IS_LOCAL ?? true;

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
        ] );
        
        const qrCodeData = await QRCode.toDataURL(
            `${ process.env.NEXT_PUBLIC_URL }/${ lang }/redirection?bookingId=${ encodeURIComponent( bookingId ) }&hotelName=${ encodeURIComponent( bookingDetails?.hotelName ) }&name=${ encodeURIComponent( bookingDetails?.name ) }&hotelAddress=${ encodeURIComponent( bookingDetails?.hotelAddress ) }&target=${ encodeURIComponent( `${ process.env.NEXT_PUBLIC_URL }/${ lang }/trip?bookingId=${ bookingId }&hotelId=${ hotelId }&scan=true` ) }`
        );

        // console.log( language?.invoice );
        const content = await generateHtml(bookingDetails, language, qrCodeData);

        let browser: Browser | BrowserCore;
        // await chromium.font(
        //     "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
        // );
        // await chromium.font(
        //     "https://raw.githack.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf"
        // );

        if ( isServer )
        {
            const executablePath = await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar')
            browser = await puppeteerCore.launch({
                executablePath,
                args: chromium.args,
                headless: chromium.headless,
                defaultViewport: chromium.defaultViewport
            })
        }
        else {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
        }
        
        const page = await browser.newPage();

        await page.setContent( content, {
            waitUntil: 'networkidle0'
        },
            { encoding: 'utf-8' }
        );

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            // margin: {
            //     top: '10px',
            //     right: '10px',
            //     bottom: '10px',
            //     left: '10px'
            // }
        });

        await browser.close();

        return new NextResponse(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${bookingId}.pdf`,
            },
        });

    } catch (error) {
        console.error('Failed to generate PDF:', error);
        return new Response(
            JSON.stringify( {
                status: 500,
                success: false,
                message: 'Failed to generate PDF.',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}