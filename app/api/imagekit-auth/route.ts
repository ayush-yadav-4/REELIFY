import ImageKit from "imagekit"
import { NextRequest, NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET(_request: NextRequest) {
    try {
        return NextResponse.json(imagekit.getAuthenticationParameters());
    } catch (_error) {
        return NextResponse.json({
            error: "ImageKit Auth Failed"
        }, { status: 500 });
    }
}