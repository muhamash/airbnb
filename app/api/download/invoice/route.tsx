import chromium from 'chrome-aws-lambda'; 
import puppeteer from 'puppeteer'; 

const isServerless = process.env.IS_AWS_LAMBDA || false; 

export async function GET(request: Request): Promise<Response> {
    try {
        const executablePath = isServerless
            ? await chromium.executablePath
            : await puppeteer.executablePath(); 
        if (!executablePath) {
            throw new Error('Chromium not available in this environment.');
        }

        const browser = await puppeteer.launch({
            executablePath,
            args: isServerless ? chromium.args : [], // Use chromium args in serverless, none in local
            headless: isServerless ? chromium.headless : true,
            defaultViewport: isServerless ? chromium.defaultViewport : null,
        });

        const page = await browser.newPage();
        await page.setContent('<h1>Hello, PDF!</h1>');
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();
        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="invoice.pdf"',
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
}