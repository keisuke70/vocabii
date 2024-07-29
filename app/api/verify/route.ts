import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { signIn } from "@/auth";
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; // Must be 256 bits (32 characters)
const SALT = process.env.SALT as string; // Ensure the salt used during encryption is the same

function decrypt(text: string): string {
  const [iv, encryptedText] = text.split(':');
  const ivBuffer = Buffer.from(iv, 'hex');
  const key = crypto.scryptSync(ENCRYPTION_KEY, SALT, 32) as Buffer;
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key as unknown as Uint8Array, ivBuffer as unknown as Uint8Array);
  let decrypted = decipher.update(new Uint8Array(encryptedBuffer)).toString('utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let token = searchParams.get("token");

  const result = await sql`select * from users where verification_token = ${token};`;

  if (result.rows.length > 0) {
    const user = result.rows[0];
    const email=user.email as FormDataEntryValue | null;
    const bcryptedPassword = decrypt(user.password);

    const hashedPassword = await bcrypt.hash(bcryptedPassword, 10);
    await sql`update users set verified = true, password = ${hashedPassword}, verification_token = NULL where verification_token = ${token};`;
    
    const password = bcryptedPassword as FormDataEntryValue | null;
    
    // await signIn("credentials", {
    //   redirect: true,
    //   redirectTo: "/dashboard",
    //   email,
    //   password ,
    // });

  } else {
    return NextResponse.json(
        { error: `Failed to signup` },
        { status: 500 }
      );
  }
}
