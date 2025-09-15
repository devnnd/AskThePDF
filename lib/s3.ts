import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function uploadToS3 (file: File) {

    if(!process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY){
        throw new Error("Environment variable(s) not defined: NEXT_PUBLIC_S3_ACCESS_KEY_ID || NEXT_PUBLIC_S3_SECRET_ACCESS_KEY");
    }

    try {
        const s3Client = new S3Client({
            region: "ap-south-1",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
            },
        });
        
        const fileKey = 'uploads/' + Date.now().toString() + '-' + file.name.replace(/-\s+/g, '-').replace(/\s+-/g, '-').replace(/ /g, '-');
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body: file
        };

        const upload = new Upload({
            client: s3Client,
            params: params,
        });

        upload.on('httpUploadProgress', (progress) => {
            const percentage = (progress.loaded! / progress.total!) * 100;
            console.log(`Upload progress: ${percentage.toFixed(2)}%`);
        });

        await upload.done().then(() => {
            console.log('File uploaded to S3: ', fileKey);
        });

        return Promise.resolve({
            fileKey,
            fileName: file.name,
        })

    } catch (error) {

        console.error(error);
        throw error;

    }
}

export function getS3Url (fileKey: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileKey}`;
    return url;
}