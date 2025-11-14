import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecondaryButton from '@/components/buttons/SecondaryButton';
import TextInput from '@/components/forms/TextInput';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    thinking?: string;
    timestamp: Date;
}

interface AIChatModalProps {
    show: boolean;
    onClose: () => void;
    user: {
        first_name: string;
        last_name: string;
    };
}

export default function AIChatModal({ show, onClose, user }: AIChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await fetch(route('ai.chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                thinking: data.thinking,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-80" onClick={onClose} />

                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

                    <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-[#2a2a2a] sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:border-[#3a3a3a] dark:from-[#2a2a2a] dark:to-[#2a2a2a]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Powered by advanced AI
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {messages.length > 0 && (
                                    <SecondaryButton onClick={handleClearChat} type="button">
                                        Clear Chat
                                    </SecondaryButton>
                                )}
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="h-[500px] overflow-y-auto bg-gray-50 px-6 py-4 dark:bg-[#1a1a1a]">
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                                        <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Welcome, {user.first_name}!
                                    </h4>
                                    <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                                        I'm your AI assistant. Ask me anything about your library management system, 
                                        or any general questions you might have. I'm here to help!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex max-w-[80%] gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                                    message.role === 'user' 
                                                        ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
                                                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                }`}>
                                                    {message.role === 'user' ? (
                                                        <User className="h-5 w-5 text-white" />
                                                    ) : (
                                                        <Bot className="h-5 w-5 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {message.thinking && (
                                                        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm italic text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                                                            <span className="font-semibold">Thinking: </span>
                                                            {message.thinking}
                                                        </div>
                                                    )}
                                                    <div className={`rounded-lg px-4 py-2 ${
                                                        message.role === 'user'
                                                            ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white'
                                                            : 'bg-white text-gray-900 shadow-sm dark:bg-[#2a2a2a] dark:text-gray-100'
                                                    }`}>
                                                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                                    </div>
                                                    <span className={`text-xs text-gray-400 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                                    <Bot className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-[#2a2a2a]">
                                                    <div className="flex gap-1">
                                                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
                                                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
                                                        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <TextInput
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        disabled={isLoading}
                                        className="w-full"
                                    />
                                </div>
                                <PrimaryButton
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || isLoading}
                                    type="button"
                                    className="flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                    Send
                                </PrimaryButton>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Press Enter to send, Shift+Enter for new line
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
