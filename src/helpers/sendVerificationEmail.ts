import { ApiResponse } from './../types/ApiResponse';
import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

// export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: "Mystery message | Verification code ",
        react: VerificationEmail({username, otp: verifyCode}),
        });
         return{success: true, message: " verification email successfully"}

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return{success: false, message: "failed to send verification email"}
    }
}