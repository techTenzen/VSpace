import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
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
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "./lib/protected-route";

// Create a simple wrapper to check authentication
function RequireAuth({ children }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vit-skill-space-theme">
                    <AuthProvider>
                        <div className="min-h-screen flex flex-col dark">
                            <Routes>
                                <Route path="/auth" element={<AuthPage />} />
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <HomePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <DashboardPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/skills"
                                    element={
                                        <ProtectedRoute>
                                            <SkillsPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/attendance"
                                    element={
                                        <ProtectedRoute>
                                            <AttendancePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/cgpa"
                                    element={
                                        <ProtectedRoute>
                                            <CGPAPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/idea-wall"
                                    element={
                                        <ProtectedRoute>
                                            <IdeaWallPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/learning"
                                    element={
                                        <ProtectedRoute>
                                            <LearningPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/chatbox"
                                    element={
                                        <ProtectedRoute>
                                            <ChatboxPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                            <Toaster />
                        </div>
                    </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;