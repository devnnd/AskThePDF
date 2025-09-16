import { FileWarning } from "lucide-react"

type props = {
    pdfUrl: string | undefined
}
export default function PDFViewer({pdfUrl}: props){
    if(!pdfUrl){
        return (
            <div className="w-full h-full flex-col items-center justify-center">
                <FileWarning className="w-4 h-4"/>
                <p className="text-lg">We couldn't access this PDF. Please start a new chat to try again.</p>
            </div>
        )
    }
    return (
        <iframe src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} className="w-full h-full">

        </iframe>
    )
}