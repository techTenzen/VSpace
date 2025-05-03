import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import SkillsPage from "@/pages/skills-page";
import AttendancePage from "@/pages/attendance-page";
import CGPAPage from "@/pages/cgpa-page";
import IdeaWallPage from "@/pages/idea-wall-page";
import LearningPage from "@/pages/learning-page";
import ProfilePage from "@/pages/profile-page";
import ChatboxPage from "@/pages/chatbox";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
    return (
        <Switch>
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/" component={HomePage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/skills" component={SkillsPage} />
            <ProtectedRoute path="/attendance" component={AttendancePage} />
            <ProtectedRoute path="/cgpa" component={CGPAPage} />
            <ProtectedRoute path="/idea-wall" component={IdeaWallPage} />
            <ProtectedRoute path="/learning" component={LearningPage} />
            <ProtectedRoute path="/profile" component={ProfilePage} />
            <ProtectedRoute path="/chatbox" component={ChatboxPage} />
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vit-skill-space-theme">
                <AuthProvider>
                    <div className="min-h-screen flex flex-col dark">
                        <Router />
                        <Toaster />
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;