import { db } from "@/lib/db";
import { loadS3IntoPinecone } from "@/lib/db/pinecone";
import { getS3Url } from "@/lib/db/s3";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (req: Request, res: Response) {
    const {userId} = await auth();
    if(!userId) {
        return NextResponse.json({error: 'Unauthorized.'}, {status: 401});
    }

    try {
        const body = await req.json();
        const { fileKey, fileName } = body;
        await loadS3IntoPinecone(fileKey);

        const chat_id = await db
            .insert(chats)
            .values({
                fileKey,
                pdfName: fileName,
                pdfUrl: getS3Url(fileKey),
                userId
            })
            .returning({
                insertedId: chats.id
            });

        return NextResponse.json({
            chatId: chat_id
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            error: "Error creating chat."
        }, {
            status: 500
        })
    }
}