import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Activity,
    Briefcase,
    Users,
    Megaphone,
    MoreHorizontal,
    Mail,
    ChartLine,
    CalendarCheck,
    GraduationCap,
    Lightbulb,
    Book,
    LogOut,
    User,
    Bot,
    Search,
    ExternalLink,
    ChevronRight,
    Terminal,
    Sparkles, MessageSquare, PenTool, Orbit
} from "lucide-react";

export default function SidebarNav() {
    const location = useLocation();
    const { user, logoutMutation } = useAuth();
    const [searchFocused, setSearchFocused] = useState(false);
    const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
    const [aiMessages, setAiMessages] = useState([
        { content: "How can I help you today?", isBot: true }
    ]);
    const [inputMessage, setInputMessage] = useState("");

    // Animation for navbar items on mount
    useEffect(() => {
        // This will trigger animations when component mounts
    }, []);

    const getInitials = (name) => {
        if (!name) return "VU";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const navItems = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            href: "/dashboard",
            isExternal: false
        },
        {
            title: "Skills",
            icon: <ChartLine className="h-5 w-5" />,
            href: "/skills",
            isExternal: false
        },
        {
            title: "Attendance",
            icon: <CalendarCheck className="h-5 w-5" />,
            href: "/attendance",
            isExternal: false
        },
        {
            title: "CGPA",
            icon: <GraduationCap className="h-5 w-5" />,
            href: "/cgpa",
            isExternal: false
        },
        {
            title: "Idea Wall",
            icon: <Lightbulb className="h-5 w-5" />,
            href: "/idea-wall",
            isExternal: false
        },
        {
            title: "Learning",
            icon: <Book className="h-5 w-5" />,
            href: "/learning",
            isExternal: false
        },
        {
            title: "AI Assistant",
            icon: <Sparkles className="h-5 w-5" />,
            href: "/chatbox",
            isExternal: false
        },
        {
            title: "V Exchange",
            icon: <Orbit className="h-5 w-5" />,
            href: "https://vtalk-production.up.railway.app",
            isExternal: true
        },{
            title: "V Craft",
            icon: <PenTool className="h-5 w-5" />,
            href: "https://resume-craft-analyze-evolve.lovable.app/",
            isExternal: true
        }
    ];

    const openFeatureSuggestionGmail = () => {
        const to = encodeURIComponent("admin@vitcentral.app");
        const subject = encodeURIComponent("Feature Suggestion");
        const body = encodeURIComponent("Hi,\n\nI'd like to suggest...");

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
        window.open(gmailUrl, "_blank");
    };

    const handleAiSubmit = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        setAiMessages([...aiMessages, { content: inputMessage, isBot: false }]);

        // Simulate AI response
        setTimeout(() => {
            setAiMessages(prev => [
                ...prev,
                { content: `I can help with that! Here's information about ${inputMessage}.`, isBot: true }
            ]);
        }, 1000);

        setInputMessage("");
    };

    return (
        <div className="hidden md:flex flex-col w-64 shrink-0 relative overflow-hidden transition-all duration-300 ease-in-out"
             style={{
                 background: "var(--sidebar-bg)",
                 color: "var(--light-grey)",
                 borderRight: "1px solid rgba(255, 255, 255, 0.05)"
             }}>
            {/* Logo and branding with animation */}
            <motion.div
                className="p-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link to="/dashboard">
                    <motion.span
                        className="text-xl md:text-3xl font-extrabold flex items-center cursor-pointer font-rubik tracking-tight"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <span style={{ color: "var(--accent-orange)" }}>VIT</span>
                        <span className="ml-1 text-white drop-shadow-lg">Central</span>
                    </motion.span>
                </Link>

            </motion.div>

            {/* Search box with animation */}
            <motion.div
                className="px-6 mb-4 relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >

            </motion.div>

            {/* User profile card with animation */}
            <motion.div
                className="px-6 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div
                    className="rounded-lg p-4 flex items-center space-x-4 border border-transparent transition-all duration-300"
                    style={{ background: "var(--profile-card-bg)" }}
                    whileHover={{
                        borderColor: "rgba(255, 165, 0, 0.5)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                    }}
                >
                    <Avatar>
                        <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                        <AvatarFallback style={{ background: "var(--avatar-fallback-bg)", color: "white" }}>
                            {getInitials(user?.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <div className="font-medium truncate text-white">{user?.fullName || "VITIAN"}</div>
                        <div className="text-sm truncate" style={{ color: "var(--light-grey)" }}>{user?.email}</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Navigation links with animations */}
            <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide">
                <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {navItems.map((item, index) => {
                        const isActive = !item.isExternal && !item.isAction && location.pathname === item.href
                        const NavItem = () => (
                            <motion.div
                                className="flex items-center justify-between h-10 px-3 py-2 text-sm rounded-md transition-colors group relative"
                                style={{
                                    background: isActive
                                        ? "var(--dark-orange-gradient)"
                                        : "transparent",
                                    color: isActive ? "#ffffff" : "var(--light-grey)"
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                whileHover={{
                                    backgroundColor: isActive ? undefined : "rgba(255, 255, 255, 0.05)",
                                    scale: 1.02,
                                    transition: { type: "spring", stiffness: 400, damping: 10 }
                                }}
                            >
                                <div className="flex items-center">
                                    <motion.span
                                        className="opacity-90"
                                        whileHover={{ rotate: isActive ? 0 : 5 }}
                                    >
                                        {item.icon}
                                    </motion.span>
                                    <span className="ml-3">{item.title}</span>
                                </div>
                                {isActive && (
                                    <motion.div
                                        className="w-1 h-full absolute right-0 top-0 bg-white rounded-l"
                                        layoutId="activeIndicator"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                {item.isExternal && (
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </motion.div>
                        );

                        if (item.isAction) {
                            return (
                                <div key={item.title} onClick={item.action} className="cursor-pointer">
                                    <NavItem />
                                </div>
                            );
                        } else if (item.isExternal) {
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <NavItem />
                                </a>
                            );
                        } else {
                            return (
                                <Link key={item.title} to={item.href} className="block">
                                    <NavItem />
                                </Link>
                            );
                        }
                    })}
                </motion.div>

                {/* Upcoming Section */}
                <motion.div
                    className="mt-6 px-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <motion.div
                        className="flex items-center justify-between"
                        initial={{ y: -5 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-xs uppercase font-semibold mb-2 text-gray-400 flex items-center">
                            <Sparkles className="h-3 w-3 mr-1 text-orange-400" />
                            Upcoming
                        </div>
                        <motion.div
                            className="text-xs text-orange-400 mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Soon™
                        </motion.div>
                    </motion.div>

                    <div className="space-y-2">
                        {/* V Play Item */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "rgba(55, 65, 81, 0.8)" // slightly lighter than bg-gray-800
                            }}
                            title="A gamified student activity & sports hub"
                            className="text-sm px-3 py-2 rounded-md bg-gray-800 text-white transition cursor-default relative overflow-hidden group border border-transparent hover:border-orange-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center">
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        className="mr-2"
                                    >
                                        <Activity className="h-4 w-4 text-orange-400" />
                                    </motion.div>
                                    <span className="font-medium">V Play</span>
                                </div>

                            </div>
                        </motion.div>

                        {/* V Career Item */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "rgba(55, 65, 81, 0.8)"
                            }}
                            title="Your career compass: jobs, internships, resume tools"
                            className="text-sm px-3 py-2 rounded-md bg-gray-800 text-white transition cursor-default relative overflow-hidden group border border-transparent hover:border-blue-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center">
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        className="mr-2"
                                    >
                                        <Briefcase className="h-4 w-4 text-blue-400" />
                                    </motion.div>
                                    <span className="font-medium">V Career</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* V Buddy Item */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "rgba(55, 65, 81, 0.8)"
                            }}
                            title="AI-enhanced peer collaboration and mentoring space"
                            className="text-sm px-3 py-2 rounded-md bg-gray-800 text-white transition cursor-default relative overflow-hidden group border border-transparent hover:border-green-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center relative z-10">
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    className="mr-2"
                                >
                                    <Users className="h-4 w-4 text-green-400" />
                                </motion.div>
                                <span className="font-medium">V Buddy</span>
                            </div>
                        </motion.div>

                        {/* V Feed Item */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "rgba(55, 65, 81, 0.8)"
                            }}
                            title="Quick links, events and club announcements"
                            className="text-sm px-3 py-2 rounded-md bg-gray-800 text-white transition cursor-default relative overflow-hidden group border border-transparent hover:border-yellow-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center relative z-10">
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    className="mr-2"
                                >
                                    <Megaphone className="h-4 w-4 text-yellow-400" />
                                </motion.div>
                                <span className="font-medium">V Feed</span>
                            </div>
                        </motion.div>

                        {/* More features */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            className="text-sm italic text-orange-400 px-3 py-2 flex items-center cursor-pointer group"
                            title="More features launching soon!"
                        >
                            <MoreHorizontal className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                            <span className="group-hover:underline">More coming soon</span>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-4 px-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <div
                        onClick={openFeatureSuggestionGmail}
                        className="cursor-pointer py-2 px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 rounded-md transition-all duration-300 flex items-center justify-center group"
                    >
                        <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-sm font-medium">Suggest a Feature</span>
                        </div>

                        <motion.div
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={{ x: -5 }}
                            whileHover={{ x: 0 }}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </motion.div>
                    </div>
                </motion.div>


            </nav>

            {/* AI Assistant Popup */}
            <AnimatePresence>
                {aiAssistantOpen && (
                    <motion.div
                        className="absolute bottom-24 left-6 right-6 bg-gray-900 rounded-lg shadow-lg z-10 overflow-hidden border border-gray-700"
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 20, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
                            <div className="flex items-center">
                                <Sparkles className="h-5 w-5 text-orange-400 mr-2" />
                                <span className="font-medium text-white">AI Assistant</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-auto"
                                onClick={() => setAiAssistantOpen(false)}
                            >
                                ×
                            </Button>
                        </div>
                        <div className="p-3 max-h-60 overflow-y-auto">
                            {aiMessages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    className={`mb-2 p-2 rounded-lg ${msg.isBot ? 'bg-gray-800 mr-8' : 'bg-orange-700/30 ml-8'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    {msg.content}
                                </motion.div>
                            ))}
                        </div>
                        <form onSubmit={handleAiSubmit} className="p-3 border-t border-gray-700">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-grow p-2 rounded-l-lg bg-gray-800 border-0 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                                />
                                <Button
                                    type="submit"
                                    className="rounded-r-lg bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    <Terminal className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile and logout controls with animations */}
            <motion.div
                className="p-4 mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Separator className="mb-4" style={{ background: "var(--separator-color)" }} />
                <div className="space-y-2">
                    <Link to="/profile" className="block">
                        <motion.div
                            className="flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors"
                            style={{
                                background: location.pathname === "/profile"
                                    ? "var(--highlight-bg)"
                                    : "transparent",
                                color: location.pathname === "/profile" ? "#ffffff" : "var(--light-grey)"
                            }}
                            whileHover={{
                                backgroundColor: location.pathname === "/profile" ? undefined : "rgba(255, 255, 255, 0.05)",
                                scale: 1.02
                            }}
                        >
                            <User className="h-5 w-5 opacity-90" />
                            <span className="ml-3">Profile</span>
                        </motion.div>
                    </Link>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm h-10 group transition-all duration-300"
                            style={{
                                color: "var(--light-grey)",
                                background: "rgba(255, 255, 255, 0.03)",
                                borderRadius: "0.375rem",
                                border: "1px solid transparent"
                            }}
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            <LogOut className="h-5 w-5 mr-3 opacity-90 group-hover:text-red-400 transition-colors" />
                            <span className="group-hover:text-red-400 transition-colors">Logout</span>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}