import { cn } from '@/lib/utils'
import { UIMessage} from 'ai';
import { Loader2 } from 'lucide-react'

type Props = {
    isLoading: boolean,
    messages: UIMessage[]
}

export default function MessageList({messages, isLoading}: Props){
    if(isLoading){
        return (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <Loader2 className='w-6 h-6 animate-spin' />
            </div>
        )
    }

    if(!messages){
        return <></>
    }
    
    return (
        <div className='flex flex-col gap-2 px-4 py-4'>
            {messages.map(message => 
                <div 
                    key={message.id} 
                    className={cn("flex",
                        {"justify-end pl-10": message.role === 'user'},
                        {"justify-start pr-10": message.role === 'assistant'}
                    )}
                >
                    <div className={cn("rounded-lg px-3 py-1 text-sm ring-1 shadow-md ring-gray-900/10",
                        {"bg-blue-600 text-white": message.role === 'user'})}
                    >
                        {message.parts.map((part, index) => 
                            part.type === 'text' ? <span key={index}>{part.text}</span> : null
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}