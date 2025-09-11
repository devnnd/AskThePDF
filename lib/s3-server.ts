import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';

export async function downloadFromS3(fileKey: string) {
    if(!process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY){
        throw new Error("Environment variable(s) for S3 access are not defined.");
    }

    try {
        const s3Client = await new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
            }
        });

        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

        const params = {
            Bucket: bucketName,
            Key: fileKey
        };

        const command = new GetObjectCommand(params);
        const { Body } = await s3Client.send(command);

        if (!Body) {
            throw new Error("S3 object body is undefined.")
        }

        // convert the stream to a byte array using the SDK's built-in helper
        const byteArray = await Body.transformToByteArray();
        const fileBuffer = Buffer.from(byteArray);
        
        // ensure the 'tmp' directory exists before writing to it
        const dir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        const localFileName = path.join(dir, `pdf-${Date.now()}.pdf`);
        fs.writeFileSync(localFileName, fileBuffer);

        return localFileName;
    } catch (err) {
        console.error(err);
    }
}