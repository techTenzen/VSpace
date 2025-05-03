import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { UpdateUserProfile, User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  updateProfileMutation: UseMutationResult<User, Error, UpdateUserProfile>;
  completeOnboardingMutation: UseMutationResult<User, Error, OnboardingData>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
};

type OnboardingData = {
  fullName: string;
  department: string;
  joiningYear: string;
  rollNumber: string;
  gender: string;
  phoneNumber: string;
  skills?: Array<{
    name: string;
    category: string;
    proficiency: number;
    notes?: string;
  }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isInitialAuthCheckDone, setIsInitialAuthCheckDone] = useState(false);

  const {
    data: user,
    error,
    isLoading: isUserLoading,
    isSuccess,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Mark initial auth check as done once the user query resolves
  useEffect(() => {
    if (isSuccess) {
      setIsInitialAuthCheckDone(true);
    }
  }, [isSuccess]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // apiRequest already returns parsed JSON data
      return await apiRequest("POST", "/api/login", credentials);
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);

      // Clear all existing queries when the user changes
      queryClient.removeQueries({ queryKey: ["/api/subjects"] });
      queryClient.removeQueries({ queryKey: ["/api/semesters"] });
      queryClient.removeQueries({ queryKey: ["/api/ideas"] });
      queryClient.removeQueries({ queryKey: ["/api/skills"] });

      toast({
        title: "Login successful",
        description: `Welcome back${user.fullName ? ', ' + user.fullName : ''}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      // apiRequest already returns parsed JSON data
      return await apiRequest("POST", "/api/register", credentials);
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: "Please complete your profile to get started.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateUserProfile) => {
      // apiRequest already returns parsed JSON data
      return await apiRequest("PUT", "/api/user/profile", profileData);
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async (onboardingData: OnboardingData) => {
      // apiRequest already returns parsed JSON data
      return await apiRequest("PUT", "/api/user/onboarding", onboardingData);
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Onboarding completed",
        description: "Welcome to VIT Skill Space! Your profile is now set up.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Onboarding failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);

      // Clear all existing queries when the user logs out
      queryClient.removeQueries({ queryKey: ["/api/subjects"] });
      queryClient.removeQueries({ queryKey: ["/api/semesters"] });
      queryClient.removeQueries({ queryKey: ["/api/ideas"] });
      queryClient.removeQueries({ queryKey: ["/api/skills"] });

      toast({
        title: "Logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Determine overall loading state
  const isLoading = isUserLoading && !isInitialAuthCheckDone;

  return (
      <AuthContext.Provider
          value={{
            user: user ?? null,
            isLoading,
            error,
            loginMutation,
            logoutMutation,
            registerMutation,
            updateProfileMutation,
            completeOnboardingMutation,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}