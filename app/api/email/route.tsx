import nodemailer from 'nodemailer';

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json(); 
        const { email, subject, confirmationMessage } = body;

        if (!email || !subject || !confirmationMessage) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `${email}, ${subject}, ${confirmationMessage} are required`,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ADDRESS_HOST,
                pass: process.env.GMAIL_APP_PASS,
            },
        });

        const emailTemplate = `<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Airbnb</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="600"
      style="border-collapse: collapse; background-color: #ffffff; margin: 20px auto; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"
    >
      <tr>
        <td align="center" style="background-color: #087d60; color: #ffffff; padding: 20px 0; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Email Confirmation</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5; margin: 0;">
            Hi <strong>John Doe</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">
            Thank you for booking with us! Please confirm your email by clicking the button below.
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a
              href="https://github.com/muhamash"
              style="background-color: #058648; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; display: inline-block;"
            >
              Me on github!!
            </a>
          </p>
          
          <h2 style="text-align: center; font-size: 18px; margin-top: 30px;">Booking Details</h2>
          <table
            align="center"
            border="1"
            cellpadding="10"
            cellspacing="0"
            width="100%"
            style="border-collapse: collapse; margin: 20px 0; border-radius: 5px; background-color: #f8f9fa; color: #333;"
          >
            <thead style="background-color: #6d2497; color: #ffffff;">
              <tr>
                <th style="text-align: center;">Check-in</th>
                <th style="text-align: center;">Check-out</th>
                <th style="text-align: center;">Rent Type</th>
                <th style="text-align: center;">Count</th>
                <th style="text-align: center;">Per Unit Price</th>
                <th style="text-align: center;">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">2025-01-15</td>
                <td style="text-align: center;">2025-01-20</td>
                <td style="text-align: center;">Apartment</td>
                <td style="text-align: center;">1</td>
                <td style="text-align: center;">$100</td>
                <td style="text-align: center;">$500</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 14px; line-height: 1.5; color: #555;">
            If you didn't request this email, please ignore it.
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" style="background-color: #f4f4f4; color: #777; padding: 10px; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 12px;">
            &copy; 2025 My Company. All rights reserved github.com/muhamash.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`
        // Define email options
        const mailOptions = {
            from: process.env.GMAIL_ADDRESS_HOST, 
            to: email,                          
            subject: subject,
            html: emailTemplate,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        return new Response(
            JSON.stringify({
                success: true,
                message: `Email sent to the user ${email}!!!`,
                data: info,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Failed to send email:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Failed to send email.',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}