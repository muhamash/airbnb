import { fetchDictionary } from '@/utils/fetchFunction';
import nodemailer from 'nodemailer';

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
    try {
      const body = await request.json();
      const { email, subject, confirmationMessage,
        name, checkIn, checkOut, hotelName, hotelAddress, unitPrice, lang, count, rentType, total
      } = body;

      console.log(rentType);

      if (!email || !subject || !confirmationMessage) {
        return new Response(
          JSON.stringify( {
            success: false,
            message: `${ email }, ${ subject }, ${ confirmationMessage } are required`,
          } ),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      };

      const transporter = nodemailer.createTransport( {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_ADDRESS_HOST,
          pass: process.env.GMAIL_APP_PASS,
        },
      } );

      const langData = await fetchDictionary( lang );

        const emailTemplate = `<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${langData?.email?.emailTitle}</title>
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
          <h1 style="margin: 0; font-size: 24px;">${langData?.email?.emailHead}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p style="font-size: 16px; line-height: 1.5; margin: 0;">
           ${langData?.email?.salam} <strong>${name}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin: 15px 0;">
            ${langData?.email?.emailText}, ${hotelName} ;  ${langData?.email?.place} : ${hotelAddress}
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a
              href="https://github.com/muhamash"
              style="background-color: #058648; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; display: inline-block;"
            >
              ${langData?.email?.me}
            </a>
          </p>
          
          <h2 style="text-align: center; font-size: 18px; margin-top: 30px;">${langData?.email?.bookingDetails}</h2>
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
                <th style="text-align: center;">${langData?.email?.checkIn}</th>
                <th style="text-align: center;">${langData?.email?.checkOut}</th>
                <th style="text-align: center;">${langData?.email?.rent}</th>
                <th style="text-align: center;">${langData?.email?.count}</th>
                <th style="text-align: center;">${langData?.email?.unitPrice}</th>
                <th style="text-align: center;">${langData?.email?.total}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">2${checkIn}</td>
                <td style="text-align: center;">${checkOut}</td>
                <td style="text-align: center;">${langData?.email[rentType]}</td>
                <td style="text-align: center;">${count}</td>
                <td style="text-align: center;">${unitPrice}</td>
                <td style="text-align: center;">${total}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 14px; line-height: 1.5; color: #c2640c;">
            ${langData?.email?.text}
          </p>
        </td>
      </tr>
      <tr>
        <td align="center" style="background-color: #f4f4f4; color: #777; padding: 10px; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 12px;">
            &copy; ${langData?.email?.myCompany} ; ${langData?.email?.coppyRight} : github.com/muhamash.
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