import { loadS3IntoPinecone } from "@/lib/db/pinecone";
import { NextResponse } from "next/server";

export async function POST (req: Request, res: Response) {
    try {
        const body = await req.json();
        const { fileKey, fileName } = body;
        await loadS3IntoPinecone(fileKey);
        return NextResponse.json({
            message: "Success."
        });
    } catch (error) {
        return NextResponse.json({
            error: "Error creating chat."
        }, {
            status: 500
        })
    }
}