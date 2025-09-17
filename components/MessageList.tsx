import { cn } from '@/lib/utils'
import { UIMessage} from 'ai'

type Props = {
    messages: UIMessage[],
    id: string
}

export default function MessageList({messages, id}: Props){
    if(!messages){
        return <></>
    }
    
    return (
        <div className='flex flex-col gap-2 px-4 overflow-y-auto py-4' id={id}>
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