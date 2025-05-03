'use client';
import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = { content: inputMessage, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInputMessage('');

        try {
            // API call to your Flask backend
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputMessage }),
            });

            const data = await response.json();

            // Add bot response
            setMessages(prev => [...prev, {
                content: data.response,
                sender: 'bot'
            }]);
        } catch (error) {
            console.error('Error fetching from chatbot API:', error);
            setMessages(prev => [...prev, {
                content: 'Sorry, I experienced a technical issue. Please try again.',
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md h-[500px] bg-white rounded-lg shadow-lg flex flex-col">
            <div className="bg-primary p-3 rounded-t-lg">
                <h2 className="text-white font-semibold">VIT-AP Assistant</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 my-4">
                        Ask me anything about VIT-AP faculty or fees!
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${
                                msg.sender === 'user' ? 'text-right' : 'text-left'
                            }`}
                        >
                            <div
                                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                                    msg.sender === 'user'
                                        ? 'bg-primary/10 text-primary-foreground'
                                        : 'bg-muted'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="text-left mb-4">
                        <div className="inline-block p-3 rounded-lg bg-muted">
                            <div className="flex gap-2 items-center">
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-2 border-t flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about faculty or fees..."
                    className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-r-md disabled:bg-primary/50"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
