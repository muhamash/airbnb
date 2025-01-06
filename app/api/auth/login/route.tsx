import { signIn } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

interface UserRequestData {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password }: UserRequestData = await request.json();

        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        // console.log("SignIn Response:", response);

        if (response) {
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