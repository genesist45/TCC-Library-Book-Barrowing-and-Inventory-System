import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, Sparkles, Plus, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import TextInput from '@/components/forms/TextInput';
import defaultUserImage from '@/assets/images/avatars/default-user.png';
import axios from 'axios';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    thinking?: string;
    timestamp: Date;
}

interface Conversation {
    id: number;
    title: string;
    updated_at: string;
}

interface AIChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        first_name: string;
        last_name: string;
        profile_picture?: string;
    };
}

export default function AIChatSidebar({ isOpen, onClose, user }: AIChatSidebarProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) {
            loadConversations();
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isOpen]);

    const loadConversations = async () => {
        try {
            const response = await axios.get(route('ai.conversations'));
            setConversations(response.data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    };

    const loadConversation = async (id: number) => {
        try {
            const response = await axios.get(route('ai.conversations.get', id));
            setCurrentConversationId(response.data.id);
            setMessages(response.data.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
            })));
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const saveConversation = async (messagesToSave?: Message[]) => {
        const msgs = messagesToSave || messages;
        if (msgs.length === 0) return;

        const title = msgs[0].content.substring(0, 50) + (msgs[0].content.length > 50 ? '...' : '');

        try {
            const payload: any = {
                title,
                messages: msgs.map(m => ({
                    ...m,
                    timestamp: m.timestamp.toISOString()
                })),
            };
            
            if (currentConversationId) {
                payload.id = currentConversationId;
            }
            
            const response = await axios.post(route('ai.conversations.save'), payload);
            setCurrentConversationId(response.data.id);
            await loadConversations();
        } catch (error) {
            console.error('Error saving conversation:', error);
            if (axios.isAxiosError(error)) {
                alert(`Failed to save conversation: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const deleteConversation = async (id: number) => {
        try {
            await axios.delete(route('ai.conversations.delete', id));
            await loadConversations();
            if (currentConversationId === id) {
                handleNewChat();
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
        loadConversations();
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await axios.post(route('ai.chat'), {
                message: userMessage.content,
                history: messages.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.response,
                thinking: response.data.thinking,
                timestamp: new Date(),
            };

            const updatedMessagesWithAI = [...updatedMessages, aiMessage];
            setMessages(updatedMessagesWithAI);
            
            saveConversation(updatedMessagesWithAI);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/50 transition-opacity duration-300 dark:bg-black/60"
                    onClick={onClose}
                />
            )}

            <div 
                className={`fixed right-0 top-0 z-50 flex h-screen w-[420px] flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-[#3a3a3a] dark:bg-[#2a2a2a] ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 dark:border-[#3a3a3a] dark:from-[#2a2a2a] dark:to-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                DeepSeek R1T2 Chimera
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-500 dark:hover:bg-[#3a3a3a] dark:hover:text-gray-300"
                        aria-label="Close AI Assistant"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="border-b border-gray-200 bg-gray-50 dark:border-[#3a3a3a] dark:bg-[#1a1a1a]">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#2a2a2a]"
                    >
                        <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Chat History ({conversations.length})
                        </span>
                        {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {showHistory && (
                        <div className="max-h-48 overflow-y-auto border-t border-gray-200 bg-white px-2 py-2 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                            <button
                                onClick={handleNewChat}
                                className="mb-2 flex w-full items-center gap-2 rounded-lg border border-blue-500 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                                <Plus className="h-4 w-4" />
                                New Chat
                            </button>
                            {conversations.length === 0 ? (
                                <p className="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                    No previous conversations
                                </p>
                            ) : (
                                <div className="space-y-1">
                                    {conversations.map((conv) => (
                                        <div
                                            key={conv.id}
                                            className={`group flex items-center gap-2 rounded-lg p-2 transition-colors ${
                                                currentConversationId === conv.id
                                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                                    : 'hover:bg-gray-100 dark:hover:bg-[#3a3a3a]'
                                            }`}
                                        >
                                            <button
                                                onClick={() => loadConversation(conv.id)}
                                                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
                                            >
                                                <span className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                                                    {conv.title}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                                    {formatDate(conv.updated_at)}
                                                </span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteConversation(conv.id);
                                                }}
                                                className="rounded p-1 text-red-600 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 dark:text-red-400 dark:hover:bg-red-900/20"
                                                aria-label="Delete conversation"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 dark:bg-[#1a1a1a]">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="mb-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">
                                Welcome, {user.first_name}!
                            </h4>
                            <p className="max-w-sm text-xs text-gray-500 dark:text-gray-400">
                                I'm your AI assistant. Ask me anything about your library management system, 
                                or any general questions you might have.
                            </p>
                            <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-[10px] text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                💡 Short messages get instant responses!
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {message.role === 'user' ? (
                                            <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 dark:border-gray-600">
                                                {user.profile_picture ? (
                                                    <img
                                                        src={`/storage/${user.profile_picture}`}
                                                        alt={user.first_name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={defaultUserImage}
                                                        alt={user.first_name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                                <Bot className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1.5">
                                            {message.thinking && (
                                                <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs italic text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                                                    <span className="font-semibold">Thinking: </span>
                                                    {message.thinking}
                                                </div>
                                            )}
                                            <div className={`rounded-lg px-3 py-2 ${
                                                message.role === 'user'
                                                    ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white'
                                                    : 'bg-white text-gray-900 shadow-sm dark:bg-[#2a2a2a] dark:text-gray-100'
                                            }`}>
                                                <p className="whitespace-pre-wrap text-xs leading-relaxed">{message.content}</p>
                                            </div>
                                            <span className={`text-[10px] text-gray-400 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-[#2a2a2a]">
                                            <div className="flex gap-1">
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-[#3a3a3a] dark:bg-[#2a2a2a]">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <TextInput
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="w-full text-sm"
                            />
                        </div>
                        <PrimaryButton
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            type="button"
                            className="flex items-center gap-1.5 px-4"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </PrimaryButton>
                    </div>
                    <p className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                        Press Enter to send • Shift+Enter for new line
                    </p>
                </div>
            </div>
        </>
    );
}
