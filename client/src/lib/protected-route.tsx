import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();

    console.log("User:", user); // Check user state
    console.log("Is Loading:", isLoading); // Check if loading is true

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

    return <>{children}</>;
}
