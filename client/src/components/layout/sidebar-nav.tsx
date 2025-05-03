import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ChartLine,
  CalendarCheck,
  GraduationCap,
  Lightbulb,
  Book,
  LogOut,
  User,
  Bot,
  Search
} from "lucide-react";

export default function SidebarNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const getInitials = (name: string | null | undefined) => {
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
    },
    {
      title: "Skills",
      icon: <ChartLine className="h-5 w-5" />,
      href: "/skills",
    },
    {
      title: "Attendance",
      icon: <CalendarCheck className="h-5 w-5" />,
      href: "/attendance",
    },
    {
      title: "CGPA",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/cgpa",
    },
    {
      title: "Idea Wall",
      icon: <Lightbulb className="h-5 w-5" />,
      href: "/idea-wall",
    },
    {
      title: "Learning",
      icon: <Book className="h-5 w-5" />,
      href: "/learning",
    },
    {
      title: "Chatbot",
      icon: <Bot className="h-5 w-5" />,
      href: "/chatbox",
    },
  ];

  return (
      <div className="hidden md:flex flex-col w-64 shrink-0"
           style={{
             background: "linear-gradient(180deg, #111827 0%, #0c111a 100%)",
             color: "#a0aec0",
             borderRight: "1px solid rgba(255, 255, 255, 0.05)"
           }}>
        {/* Logo and branding */}
        <div className="p-6">
          <Link href="/dashboard">
          <span className="text-xl font-bold flex items-center cursor-pointer">
            <span style={{ color: "#3772ff" }}>VIT</span>
            <span className="ml-1 text-white">Skill Space</span>
          </span>
          </Link>
        </div>

        {/* Search box */}
        <div className="px-6 mb-4 relative">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search anything..."
                className="w-full py-2 pl-10 pr-4 rounded-xl text-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#a0aec0",
                  outline: "none"
                }}
            />
          </div>
        </div>

        {/* User profile card */}
        <div className="px-6 mb-6">
          <div className="rounded-lg p-4 flex items-center space-x-4"
               style={{ background: "linear-gradient(90deg, rgba(55, 114, 255, 0.15) 0%, rgba(55, 114, 255, 0.05) 100%)" }}>
            <Avatar>
              <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
              <AvatarFallback style={{ background: "linear-gradient(135deg, #3772ff 0%, #2952cc 100%)", color: "white" }}>
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="font-medium truncate text-white">{user?.fullName || "VIT Student"}</div>
              <div className="text-sm truncate" style={{ color: "#a0aec0" }}>{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                      className="flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors"
                      style={{
                        background: location === item.href
                            ? "linear-gradient(90deg, rgba(55, 114, 255, 0.2) 0%, rgba(55, 114, 255, 0.05) 100%)"
                            : "transparent",
                        color: location === item.href ? "#ffffff" : "#a0aec0"
                      }}
                  >
                    <span className="opacity-90">{item.icon}</span>
                    <span className="ml-3">{item.title}</span>
                  </a>
                </Link>
            ))}
          </div>
        </nav>

        {/* Profile and logout controls */}
        <div className="p-4 mt-auto">
          <Separator className="mb-4" style={{ background: "rgba(255, 255, 255, 0.05)" }} />
          <div className="space-y-2">
            <Link href="/profile">
              <a
                  className="flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors"
                  style={{
                    background: location === "/profile"
                        ? "linear-gradient(90deg, rgba(55, 114, 255, 0.2) 0%, rgba(55, 114, 255, 0.05) 100%)"
                        : "transparent",
                    color: location === "/profile" ? "#ffffff" : "#a0aec0"
                  }}
              >
                <User className="h-5 w-5 opacity-90" />
                <span className="ml-3">Profile</span>
              </a>
            </Link>
            <Button
                variant="ghost"
                className="w-full justify-start text-sm h-10"
                style={{
                  color: "#a0aec0",
                  background: "transparent",
                  borderRadius: "0.375rem"
                }}
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5 mr-3 opacity-90" />
              Logout
            </Button>
          </div>
        </div>
      </div>
  );
}