import { userModel } from '@/models/users';
import { dbConnect } from '@/services/mongoDB';
import { generateVerificationToken } from '@/utils/utils';
import nodemailer from 'nodemailer';

async function sendVerificationEmail(email: string, token: string, lang: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_ADDRESS_HOST,
          pass: process.env.GMAIL_APP_PASS,
        },
    });

    const verificationLink = `${ process.env.NEXT_PUBLIC_URL }/${ lang }/verify/success?token=${ token }&email=${ email }`;

    const message = {
        from: process.env.GMAIL_ADDRESS_HOST,
        to: email,
        subject: 'Airbnb email Verification',
        text: `Click on the link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(message);
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const { email, lang } = body;
        console.log( email, lang, body );
        if (!email || !lang) {
            return new Response(
                JSON.stringify( {
                    success: false,
                    message: "Invalid email or language.",
                    status: 400,
                } ),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        };

        await dbConnect();

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            if (existingUser?.emailVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: 'User already verified!',
                        status: 400,
                    }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const token = await generateVerificationToken();
        const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000);

        existingUser.verificationToken = token;
        existingUser.tokenExpiration = tokenExpiration;
        await existingUser.save({ validateModifiedOnly: true });
        await sendVerificationEmail(email, token, lang);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Verification email sent!',
                status: 200,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Failed to send email:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Failed to send email.',
                status: 500,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function GET(request: Request): Promise<Response> {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');
        
        if (!token) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'No token!',
                    status: 400,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await dbConnect();
        const user = await userModel.findOne({ verificationToken: token });

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'User not found!',
                    status: 404,
                }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if the token has expired
        const currentTime = new Date();
        if (currentTime > user.tokenExpiration) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Verification token has expired!',
                    status: 400,
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        user.emailVerified = true;
        user.verificationToken = null;
        user.tokenExpiration = null; 
        await user.save( { validateModifiedOnly: true } );

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Verification successful!',
                status: 200,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Failed to verify:', error);
        return new Response(
            JSON.stringify({
                success: false,
                status: 500,
                message: 'Failed to verify',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}