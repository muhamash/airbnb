import { userModel } from '@/models/users';
import { dbConnect } from '@/services/mongoDB';
import { generateVerificationToken } from '@/utils/utils';
import nodemailer from 'nodemailer';

async function sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_ADDRESS_HOST,
          pass: process.env.GMAIL_APP_PASS,
        },
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/api/email/verify?token=${token}`;

    const message = {
        from: process.env.GMAIL_ADDRESS_HOST,
        to: email,
        subject: 'Airbnb email Verification',
        text: `Click on the link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(message);
}

export async function POST(request: Request): Promise<Response>  {
    try
    {
        const email = request?.body;
        await dbConnect();

        const existingUser = await userModel.findOne( { email } );
        if ( existingUser )
        {
            if ( existingUser?.verified )
            {
                return new Response(
                    JSON.stringify( {
                        success: false,
                        message: 'User already verified!',
                        status: 400,
                    } ),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        const token = generateVerificationToken();
        existingUser.verificationToken = token;
        await existingUser.save();
        await sendVerificationEmail(email, token);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Verification email sent!',
                status: 200,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
    catch ( error )
    {
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

export async function GET(request:Request): Promise<Response> {
    try
    {
        const token = request?.body;
        if ( !token )
        {
            return new Response(
                JSON.stringify( {
                    success: false,
                    message: 'no token!',
                    status: 400,
                } ),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await dbConnect();
        const user = await userModel.findOne( { verificationToken: token } );

        if (!user) {
            return new Response(
                JSON.stringify( {
                    success: false,
                    message: 'User not found!',
                    status: 404,
                } ),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        user.verified = true;
        user.verificationToken = null;
        await user.save();

        return new Response(
            JSON.stringify( {
                success: true,
                message: 'Verification oka!!!!',
                status: 200,
            } ),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
    catch ( error )
    {
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