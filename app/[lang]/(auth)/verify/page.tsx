'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get( "email" );
    const [message, setMessage] = useState("");

    async function resendVerificationEmail() {
        const response = await fetch("/api/email/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (response.status === 200) {
            setMessage("Verification email sent! Check your inbox.");
        } else {
            setMessage("Failed to send verification email. Please try again.");
        }
    }

    return (
        <div className="container">
            <h1>Email Verification Required</h1>
            <p>Your email is not verified. Please verify your email to continue.</p>
            <p>Email: {email}</p>
            <button onClick={resendVerificationEmail}>Resend Verification Email</button>
            {message && <p>{message}</p>}
        </div>
    );
}