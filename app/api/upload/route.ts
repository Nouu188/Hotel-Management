import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST (
    request: Request
) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if(!file) {
        return NextResponse.json({ succcess: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: 'avatars' }, (error, result) => {
                    if (error) return reject(error);
                        resolve(result);
                })
                .end(buffer);
        });
        
        return NextResponse.json({ success: true, data: uploadResult }, { status: 200 }) 
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}