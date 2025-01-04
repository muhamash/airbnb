/* eslint-disable @typescript-eslint/no-unused-vars */
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

        const content = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        h1, h2 {
            color: #555;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            border-bottom: 2px solid #ddd;
            padding-bottom: 5px;
        }
        .details {
            margin: 10px 0;
            line-height: 1.6;
        }
        .details span {
            font-weight: bold;
        }
        .summary {
            background: #f9f9f9;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .total {
            font-size: 1.2em;
            font-weight: bold;
            color: #000;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Booking Confirmation</h1>
        <div class="section">
            <h2>Booking Information</h2>
            <div class="details">
                <span>Booking ID:</span> #6778F3E3FCF79726CB0FA834<br>
                <span>Date:</span> 04/01/2025
            </div>
        </div>
        <div class="section">
            <h2>Hotel Details</h2>
            <div class="details">
                <span>Hotel Name:</span> Hotel Sunshine<br>
                <span>Location:</span> Los Angeles, California, USA, 42028<br>
                <span>Contact:</span> +1 234 567 8900 | contact@hotel_sunshine.com
            </div>
        </div>
        <div class="section">
            <h2>Guest Information</h2>
            <div class="details">
                <span>Name:</span> Meherish<br>
                <span>Email:</span> meherish@testme.com
            </div>
        </div>
        <div class="section">
            <h2>Reservation Details</h2>
            <div class="details">
                <span>Check-in:</span> 04/01/2025<br>
                <span>Check-out:</span> 05/01/2025<br>
                <span>Nights:</span> 1<br>
                <span>Guests:</span> 4
            </div>
        </div>
        <div class="section">
            <h2>Billing Address</h2>
            <div class="details">
                <span>Street:</span> Laboriosam tempora<br>
                <span>City:</span> Commodo aliquid est<br>
                <span>State:</span> Earum aut commodo do<br>
                <span>ZIP Code:</span> 68527
            </div>
        </div>
        <div class="section">
            <h2>Payment Summary</h2>
            <div class="summary">
                <div><span>Room Rate (1 night × $120):</span> $120</div>
                <div><span>Cleaning Fee:</span> $17.50</div>
                <div><span>Service Fee:</span> $51.31</div>
                <div class="total">Total Amount: $188.81</div>
            </div>
        </div>
        <div class="footer">
            &copy; 2025 Hotel Sunshine. All rights reserved.
        </div>
    </div>
</body>
            </html>`;
        const page = await browser.newPage();
        await page.setContent(content);
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();
        return new Response( pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="invoice.pdf"',
            },
        } );
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