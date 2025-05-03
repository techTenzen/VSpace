import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  LayoutDashboard,
  ChartLine,
  CalendarCheck,
  GraduationCap,
  Lightbulb,
  Book,
  LogOut,
  User,
} from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [open, setOpen] = useState(false);

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
  ];

  return (
    <div className="md:hidden border-b border-accent/20 p-4 sticky top-0 z-40 bg-background">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <a className="text-xl font-bold flex items-center">
            <span className="text-primary">VIT</span>
            <span className="ml-1">Skill Space</span>
          </a>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar text-sidebar-foreground">
            <div className="flex flex-col h-full">
              {/* User profile section */}
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={user?.profilePicture || ""}
                      alt={user?.fullName || "User"}
                    />
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

              <Separator className="mb-4" />

              {/* Navigation links */}
              <nav className="flex-1">
                <div className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors ${
                          location === item.href
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer actions */}
              <div className="p-4 mt-auto">
                <Separator className="mb-4" />
                <div className="space-y-2">
                  <Link href="/profile">
                    <a
                      className={`flex items-center h-10 px-3 py-2 text-sm rounded-md transition-colors ${
                        location === "/profile"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="ml-3">Profile</span>
                    </a>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    onClick={() => {
                      logoutMutation.mutate();
                      setOpen(false);
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
