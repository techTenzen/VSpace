import { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

// Define type for chat messages
interface ChatMessage {
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const ChatboxPage: NextPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Add user message to chat
        const userMessage: ChatMessage = {
            content: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        try {
            // Call the Flask backend API
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Add bot response to chat
            const botMessage: ChatMessage = {
                content: data.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);

            // Add error message
            setMessages(prev => [...prev, {
                content: 'Sorry, I experienced a technical issue. Please try again.',
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Format time for display
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <Head>
                <title>VIT-AP Assistant | Chat</title>
                <meta name="description" content="Chat with VIT-AP Assistant for faculty and fee information" />
            </Head>

            <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gray-50">
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[600px]">
                    {/* Chat header */}
                    <div className="bg-primary p-4 text-white">
                        <h1 className="text-xl font-bold">VIT-AP Assistant</h1>
                        <p className="text-sm opacity-80">Ask me about faculty or fee information</p>
                    </div>

                    {/* Chat messages container */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <div className="mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M8 15h8M9 9h.01M15 9h.01"></path>
                                    </svg>
                                </div>
                                <p className="text-center">Hello! I'm your VIT-AP Assistant. Ask me anything about faculty or college fees.</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            msg.sender === 'user'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-gray-200 text-gray-800 rounded-tl-none'
                                        }`}
                                    >
                                        <div className="mb-1">{msg.content}</div>
                                        <div
                                            className={`text-xs ${
                                                msg.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                                            }`}
                                        >
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-200 rounded-lg p-3 rounded-tl-none text-gray-800">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about faculty or fees..."
                            className="flex-1 rounded-l-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatboxPage;
