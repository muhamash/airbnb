import nodemailer from 'nodemailer';

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
    try {
        // Parse the request body
        const body = await request.json(); // Parse JSON body
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

        // Define email options
        const mailOptions = {
            from: process.env.GMAIL_ADDRESS_HOST, 
            to: email,                          
            subject: subject,
            html: `<p>${confirmationMessage}</p>`,
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