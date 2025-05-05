import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

// Animated Ring Component
type RingProps = {
    color: string;
    duration: number;
    reverse?: boolean;
    zIndex?: number;
};
const ringShapes = [
    "38% 62% 63% 37% / 41% 44% 56% 59%",
    "41% 44% 56% 59%/38% 62% 63% 37%",
];
function Ring({ color, duration, reverse = false, zIndex = 1 }: RingProps) {
    const animationName = `ring-rotate-${color.replace("#", "")}-${duration}-${reverse ? "rev" : "fwd"}`;
    if (typeof window !== "undefined" && !document.getElementById(animationName)) {
        const style = document.createElement("style");
        style.id = animationName;
        style.innerHTML = `
            @keyframes ${animationName} {
                0% { transform: rotate(${reverse ? 360 : 0}deg); }
                100% { transform: rotate(${reverse ? 0 : 360}deg); }
            }
        `;
        document.head.appendChild(style);
    }
    const borderRadius = reverse ? ringShapes[1] : ringShapes[0];
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                border: "3px solid #fff",
                borderRadius,
                transition: "0.5s",
                zIndex,
                animation: `${animationName} ${duration}s linear infinite`,
                pointerEvents: "none",
                filter: `drop-shadow(0 0 20px ${color})`,
                opacity: 0.8,
            }}
        />
    );
}

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
    email: z.string().email("Please enter a valid email").endsWith("vit.ac.in", "Please use your VIT email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function AuthPage() {
    const { user, loginMutation, registerMutation } = useAuth();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [activeTab, setActiveTab] = useState<string>("login");

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
        },
    });

    const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
        loginMutation.mutate({
            email: values.email,
            password: values.password,
        });
    };

    const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
        const { confirmPassword, termsAccepted, ...userData } = values;
        registerMutation.mutate(userData);
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    if (user) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#22202a] relative overflow-hidden">
            {/* Animated Rings Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[750px] h-[750px]">
                    <Ring color="#00ff0a" duration={6} zIndex={1} />
                    <Ring color="#ff0057" duration={4} zIndex={2} reverse />
                    <Ring color="#fffd44" duration={10} zIndex={3} />
                </div>
            </div>

            {/* Auth Content */}
            <div className="w-full max-w-xl mx-4 relative z-10">
                <Card className="border-0 bg-[#26223a]/90 backdrop-blur-xl rounded-2xl shadow-xl">
                    <CardContent className="p-10">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Welcome to <span className="text-orange-500">VIT Skill Space</span>
                            </h1>
                            <p className="text-gray-300">
                                Your comprehensive toolkit for personal and academic growth at VIT-AP
                            </p>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="flex w-full overflow-hidden rounded-xl bg-[#23243a] p-1 mb-8">
                                <TabsTrigger
                                    value="login"
                                    className={`flex-1 py-3 font-semibold text-lg transition-all rounded-none
                                        ${activeTab === 'login'
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow'
                                        : 'text-gray-400 hover:text-white bg-transparent'
                                    }`}
                                >
                                    Login
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className={`flex-1 py-3 font-semibold text-lg transition-all rounded-none
                                        ${activeTab === 'register'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow'
                                        : 'text-gray-400 hover:text-white bg-transparent'
                                    }`}
                                >
                                    Sign Up
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="youremail@vit.ac.in"
                                                            className="bg-[#1e1c29] border-gray-700 text-white rounded-xl py-5 px-4 focus:ring-2 focus:ring-orange-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                            placeholder="••••••••"
                                                            className="bg-[#1e1c29] border-gray-700 text-white rounded-xl py-5 px-4 focus:ring-2 focus:ring-orange-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-center justify-between">
                                            <FormField
                                                control={loginForm.control}
                                                name="rememberMe"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="accent-orange-500 border-gray-600"
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-gray-400">Remember me</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                            <a href="#" className="text-orange-400 hover:text-orange-300 text-sm">
                                                Forgot password?
                                            </a>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-5 rounded-xl text-lg font-semibold transition-all"
                                            disabled={loginMutation.isPending}
                                        >
                                            {loginMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Logging in...
                                                </>
                                            ) : (
                                                "Login"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>

                            <TabsContent value="register">
                                <Form {...registerForm}>
                                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                                        <FormField
                                            control={registerForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="youremail@vit.ac.in"
                                                            className="bg-[#1e1c29] border-gray-700 text-white rounded-xl py-5 px-4 focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                            placeholder="Create a strong password"
                                                            className="bg-[#1e1c29] border-gray-700 text-white rounded-xl py-5 px-4 focus:ring-2 focus:ring-blue-500"
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                calculatePasswordStrength(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <div className="mt-3 flex gap-1.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1.5 w-full rounded-full ${
                                                                    passwordStrength > i
                                                                        ? i < 2 ? 'bg-red-500'
                                                                            : i < 4 ? 'bg-yellow-500'
                                                                                : 'bg-green-500'
                                                                        : 'bg-gray-800'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    {passwordStrength > 0 && (
                                                        <p className="text-sm mt-2 text-gray-400">
                                                            Password strength:{" "}
                                                            <span className={
                                                                passwordStrength < 3 ? 'text-red-500' :
                                                                    passwordStrength < 4 ? 'text-yellow-500' :
                                                                        'text-green-500'
                                                            }>
                                                                {passwordStrength < 3 ? 'Weak' :
                                                                    passwordStrength < 4 ? 'Medium' : 'Strong'}
                                                            </span>
                                                        </p>
                                                    )}
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                            placeholder="Confirm your password"
                                                            className="bg-[#1e1c29] border-gray-700 text-white rounded-xl py-5 px-4 focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-red-500" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
                                            name="termsAccepted"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start space-x-3">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="accent-blue-500 border-gray-600 mt-1"
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-gray-400 cursor-pointer">
                                                            I agree to the{" "}
                                                            <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>{" "}
                                                            and{" "}
                                                            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 rounded-xl text-lg font-semibold transition-all"
                                            disabled={registerMutation.isPending}
                                        >
                                            {registerMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Creating account...
                                                </>
                                            ) : (
                                                "Sign Up"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
