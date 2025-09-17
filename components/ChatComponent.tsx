'use client';
import { Send } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import MessageList from "./MessageList";

type Props = {
    chatId: number
};

export default function ChatComponent({ chatId }: Props){
    const {messages, sendMessage, status} = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            body: {
                chatId
            }
        }),
    });
    const [input, setInput] = useState('');

    useEffect(()=>{
        const messageList = document.getElementById('message-list');
        messageList && messageList.scrollTo({
            top: messageList.scrollHeight,
            behavior: 'smooth'
        })
    });

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 w-full top-0 inset-x-0 bg-white h-fit">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} id={'message-list'}/>
            </div>

            {/* Chat input */}
            <div className="flex-shrink-0 p-4">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if(input.trim()){
                            sendMessage({
                                text: input
                            });
                            setInput('');
                        }
                    }}
                    className="flex gap-1"
                >
                    <Input 
                        value={input} 
                        onChange={e => {
                            setInput(e.target.value);
                        }} 
                        disabled={status !== 'ready'}
                        className="w-full"
                        placeholder="Say something..."
                    />
                    <Button type="submit" disabled={status !== 'ready'}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form> 
            </div>
        </div>
    )
}