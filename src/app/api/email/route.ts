import { EmailTemplate } from "@/components/emails/FirstEmail";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = emailSchema.parse(body);
  try {
    // Comentar el código relacionado con el envío de correos electrónicos
    /*
    const data = await resend.emails.send({
      from: "Kirimase <onboarding@resend.dev>",
      to: [email],
      subject: "Hello world!",
      react: EmailTemplate({ firstName: name }),
      text: "Email powered by Resend.",
    });
    */

    // Puedes devolver una respuesta de éxito temporalmente
    return NextResponse.json({ success: true, message: "Email sending is disabled." });
  } catch (error) {
    return NextResponse.json({ success: false, message: "An error occurred.", error: "An unknown error occurred"  });
  }
}
