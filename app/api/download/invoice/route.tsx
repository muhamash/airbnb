/* eslint-disable @typescript-eslint/no-unused-vars */
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export async function GET(request: Request): Promise<Response> {
    try {
        const executablePath = await chromium.executablePath;

        if (!executablePath) {
            throw new Error('Chromium not available in this environment.');
        }

        const browser = await puppeteer.launch( {
            executablePath,
            args: chromium.args,
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
        } );

        const page = await browser.newPage();
        await page.setContent('<h1>Hello, PDF!</h1>');
        const pdfBuffer = await page.pdf( { format: 'A4' } );

        await browser.close();
        return new Response( pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="invoice.pdf"',
            },
        } );
    } catch (error) {
        console.error( 'Failed to generate PDF:', error );

        return new Response(
            JSON.stringify( {
                success: false,
                message: 'Failed to generate PDF.',
            } ),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}