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
  Bot // <-- Add this if you have a bot icon, else use any icon you prefer
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
    // --- Add Chatbot nav item here ---
    {
      title: "Chatbot",
      icon: <Bot className="h-5 w-5" />, // Use Bot icon or any chat icon you have
      href: "/chatbox",
    },
  ];

  return (
      <div className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border shrink-0">
        {/* Logo and branding */}
        <div className="p-6">
          <Link href="/dashboard">
          <span className="text-xl font-bold flex items-center cursor-pointer">
            <span className="text-primary">VIT</span>
            <span className="ml-1">Skill Space</span>
          </span>
          </Link>
        </div>

        {/* User profile card */}
        <div className="px-6 mb-6">
          <div className="bg-sidebar-accent/10 rounded-lg p-4 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user?.fullName || "VIT Student"}</div>
              <div className="text-sm text-sidebar-foreground/70 truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                      className={`flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors ${
                          location === item.href
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </a>
                </Link>
            ))}
          </div>
        </nav>

        {/* Profile and logout controls */}
        <div className="p-4 mt-auto">
          <Separator className="mb-4 bg-sidebar-border" />
          <div className="space-y-2">
            <Link href="/profile">
              <a
                  className={`flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors ${
                      location === "/profile"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
              >
                <User className="h-5 w-5" />
                <span className="ml-3">Profile</span>
              </a>
            </Link>
            <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
  );
}
