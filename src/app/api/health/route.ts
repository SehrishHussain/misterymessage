// app/test/route.ts
import { resend } from '@/lib/resend';

export async function GET() {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'YOUR_TEST_EMAIL@gmail.com',
    subject: 'TEST',
    text: 'Working?'
  });
  return new Response('Test sent');
}