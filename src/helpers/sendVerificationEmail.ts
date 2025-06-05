import { ApiResponse } from './../types/ApiResponse';
import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  react: <Email url="https://example.com" />,
});
         return{success: true, message: " verification email successfully"}

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return{success: false, message: "failed to send verification email"}
    }
}