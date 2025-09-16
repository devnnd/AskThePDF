"use client";
import { useDropzone } from 'react-dropzone';
import { Inbox, Loader2 } from 'lucide-react';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
    const route = useRouter();
    const [ uploading, setUploading ] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async ({fileKey, fileName}: {fileKey: string, fileName: string}) => {
            const response = await axios.post('/api/create-chat', {fileKey, fileName});
            return response.data;
        }
    })

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: { "application/pdf" : [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            // check for files larger than 10MB
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File too large. Please upload a file smaller than 10MB.");
                return;
            }

            try {
                setUploading(true);

                const data = await uploadToS3(file);
                if(!data.fileKey || !data.fileName) {
                    toast.error('Something went wrong.');
                    return;
                }
                mutate(data, {
                    onSuccess: ({chatId}) => {
                        toast.success('Chat created.');
                        route.push(`/chat/${chatId}`)
                    },
                    onError: (err) => {
                        toast.error(err.message)
                    }
                });
            } catch (error) {
                console.error(error);
            } finally {
                setUploading(false);
            }
        }
    });
    return (
        <div className='p-2 bg-white rounded-2xl'>
            <div {...getRootProps({
                className: "border-dashed border-2 bg-gray-50 rounded-xl cursor-pointer py-8 flex flex-col justify-center items-center"
            })}>
                <input {...getInputProps()} />
                { uploading || isPending ? (
                    <>
                        <Loader2 className='w-10 h-10 text-blue-500 animate-spin' />
                        <p className='mt-2 text-sm text-slate-400'>The magic is happening! Your PDF is on its way.</p>
                    </>
                ) : (
                    <>
                        <Inbox className='w-10 h-10 text-blue-500'/>
                        <p className='mt-2 text-sm text-slate-400'>
                            {isDragActive ? "Drop the PDF here..." : "Drag n' drop a PDF here, or click to select"}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default FileUpload;