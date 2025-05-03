import { useState, useRef, useEffect } from 'react';

export default function ChatboxPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            content: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput('');

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const botMessage = {
                content: data.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, {
                content: 'Sorry, I experienced a technical issue. Please try again.',
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background"
            style={{
                backgroundImage: "url('your-image-path.jpg')", // Replace with your image path
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="w-full max-w-2xl bg-card/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[36rem] backdrop-blur-md border border-border">
                {/* Chat header */}
                <div className="bg-primary p-4 text-primary-foreground border-b border-border">
                    <h1 className="text-xl font-bold">VIT-AP Assistant</h1>
                    <p className="text-sm opacity-80">Ask me about faculty or fee information</p>
                </div>

                {/* Chat messages container */}
                <div className="flex-1 p-4 overflow-y-auto bg-background/70">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
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
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-muted text-muted-foreground rounded-tl-none'
                                    }`}
                                >
                                    <div className="mb-1">{msg.content}</div>
                                    <div
                                        className={`text-xs ${
                                            msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
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
                            <div className="bg-muted rounded-lg p-3 rounded-tl-none text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-border flex bg-card/80">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about faculty or fees..."
                        className="flex-1 rounded-l-lg border border-input p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-r-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
