// app/api/user/[id]/avatar/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { NotFoundError, RequestError, UnauthorizedError } from '@/lib/http-errors'; // Thêm BadRequestError
import handleError from '@/lib/handlers/error';
import { ApiErrorResponse } from '@/types/global';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // 1. Xác thực và cấp quyền (Không đổi)
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        if (session.user.id !== params.id) {
            throw new UnauthorizedError("You can only update your own avatar.");
        }

        const userId = params.id;

        // 2. Xử lý body JSON thay vì FormData
        const body = await request.json();
        const avatarBase64 = body.avatar as string | undefined;

        if (!avatarBase64 || !avatarBase64.startsWith('data:image')) {
            throw new Error("Invalid or no avatar data provided. Expected a base64 data URL.");
        }

        // 3. Tải chuỗi base64 lên Cloudinary (Không cần buffer)
        const uploadResult = await cloudinary.uploader.upload(
            avatarBase64, // Tải lên trực tiếp từ chuỗi data URL
            {
                // Tùy chọn tải lên không đổi
                folder: 'avatars',
                public_id: userId,
                overwrite: true,
                format: 'webp',
                transformation: [
                    { width: 250, height: 250, crop: 'fill', gravity: 'face' },
                ]
            }
        );
        
        if (!uploadResult?.secure_url) {
            throw new Error("Failed to upload image to Cloudinary.");
        }

        const imageUrl = uploadResult.secure_url;

        // 4. Cập nhật URL ảnh mới vào cơ sở dữ liệu (Không đổi)
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                image: imageUrl,
            },
        });

        if (!updatedUser) {
            throw new NotFoundError("User");
        }

        // 5. Trả về kết quả thành công (Không đổi)
        return NextResponse.json({
            success: true,
            message: "Avatar updated successfully.",
            data: {
                imageUrl: updatedUser.image
            }
        }, { status: 200 });

    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}