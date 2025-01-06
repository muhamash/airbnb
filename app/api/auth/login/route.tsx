import { signIn } from "@/auth";
import { dbConnect } from "@/services/mongoDB";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface UserRequestData {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password }: UserRequestData = await request.json();
        console.log("Request Data:", { email, password });
        await dbConnect();

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 5);

        const user = {
            email,
            password: hashedPassword,
        };
        console.log( "New User Object:", user );
        
        const response = await signIn("credentials", {
            email: user.email,
            password: user.password,
            redirect: false,
        });

        console.log("SignIn Response:", response);

        if (response?.ok) {
            return NextResponse.json({ success: true, message: "Login successful." });
        } else {
            return NextResponse.json(
                { success: false, error: response?.error || "Login failed." },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}