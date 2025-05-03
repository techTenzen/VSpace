import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { RiRobot2Line, RiUser3Line } from "react-icons/ri";

interface ChatMessage {
    content: string;
    sender: "user" | "bot";
    timestamp: Date;
}

const ChatboxPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            content: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setInput("");

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            const botMessage: ChatMessage = {
                content: data.response,
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    content: "Sorry, I experienced a technical issue. Please try again.",
                    sender: "bot",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Message animation variants
    const messageVariants = {
        hidden: (isUser: boolean) => ({
            x: isUser ? 50 : -50,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 40,
                mass: 1,
            },
        },
        exit: (isUser: boolean) => ({
            x: isUser ? 50 : -50,
            opacity: 0,
            transition: { duration: 0.2 },
        }),
    };

    return (
        <>
            <Helmet>
                <title>VIT-AP Assistant | Chat</title>
                <meta
                    name="description"
                    content="Chat with VIT-AP Assistant for faculty and fee information"
                />
            </Helmet>

            <div
                className="flex flex-col items-center justify-center min-h-screen bg-background relative"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(58, 28, 113, 0.15) 0, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(0, 195, 255, 0.1) 0, transparent 50%)
                    `,
                    backgroundSize: 'cover',
                }}
            >
                {/* Tech grid background overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(66, 66, 99, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(66, 66, 99, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Animated stars (CSS-based) */}
                <div className="stars-container absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-card rounded-full"
                            style={{
                                width: Math.random() * 2 + 1 + "px",
                                height: Math.random() * 2 + 1 + "px",
                                top: Math.random() * 100 + "%",
                                left: Math.random() * 100 + "%",
                            }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: Math.random() * 5,
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="z-10 w-full max-w-3xl bg-card/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden flex flex-col h-[600px] border border-border"
                >
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-primary p-4 text-primary-foreground border-b border-border flex items-center"
                    >
                        <RiRobot2Line className="text-xl mr-2" />
                        <div>
                            <h1 className="text-xl font-bold tracking-wide">VIT-AP ASSISTANT</h1>
                            <p className="text-sm opacity-80">
                                Technical support and information system
                            </p>
                        </div>
                    </motion.div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-background/80">
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center justify-center h-full text-muted-foreground"
                            >
                                <div className="mb-4 border-2 border-muted p-5 rounded-full">
                                    <RiRobot2Line size={48} />
                                </div>
                                <p className="text-center font-mono">
                                    <span className="text-primary font-bold">SYSTEM ONLINE.</span><br />
                                    Awaiting input query regarding faculty or fee data.
                                </p>
                            </motion.div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => {
                                    const isUser = msg.sender === "user";
                                    return (
                                        <motion.div
                                            key={index}
                                            className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
                                            custom={isUser}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={messageVariants}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 flex items-start gap-2 ${
                                                    isUser
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-muted text-muted-foreground rounded-tl-none"
                                                }`}
                                            >
                                                {!isUser && (
                                                    <RiRobot2Line className="mt-1 text-muted-foreground" />
                                                )}
                                                <div className="flex-1">
                                                    <div className="mb-1 font-mono">{msg.content}</div>
                                                    <div
                                                        className={`text-xs ${
                                                            isUser
                                                                ? "text-primary-foreground/70"
                                                                : "text-muted-foreground/70"
                                                        }`}
                                                    >
                                                        {formatTime(msg.timestamp)}
                                                    </div>
                                                </div>
                                                {isUser && (
                                                    <RiUser3Line className="mt-1 text-primary-foreground/70" />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}

                        {isLoading && (
                            <motion.div
                                className="flex justify-start mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="bg-muted rounded-lg p-3 rounded-tl-none text-muted-foreground flex items-center gap-2">
                                    <RiRobot2Line className="text-muted-foreground" />
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"
                                            style={{ animationDelay: "0ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"
                                            style={{ animationDelay: "150ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"
                                            style={{ animationDelay: "300ms" }}
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onSubmit={handleSubmit}
                        className="p-3 border-t border-border flex bg-card"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="INPUT QUERY..."
                            className="flex-1 rounded-l-lg border border-input p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-r-lg hover:bg-primary/90 disabled:opacity-50 font-bold tracking-wider flex items-center"
                        >
                            <span className="mr-1">SEND</span>
                            <FiSend />
                        </button>
                    </motion.form>
                </motion.div>
            </div>
        </>
    );
};

export default ChatboxPage;
