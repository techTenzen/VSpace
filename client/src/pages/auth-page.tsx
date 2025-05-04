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
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function AuthPage() {
    const { user, loginMutation, registerMutation, isLoading } = useAuth();
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

    // Redirect if already logged in
    if (user) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#22202a]">
            {/* Left Panel - Auth Form */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-white">
                        Welcome to <span className="text-orange-500">VIT Skill Space</span>
                    </h1>
                    <p className="text-gray-400">
                        Your comprehensive toolkit for personal and academic growth at VIT-AP.
                    </p>
                </div>

                <Card className="border-gray-800 bg-[#26223a]">
                    <CardContent className="p-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login" className={`flex-1 py-2 rounded-t-lg font-semibold transition-all duration-300 ${activeTab === 'login' ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>Login</TabsTrigger>
                                <TabsTrigger value="register" className={`flex-1 py-2 rounded-t-lg font-semibold transition-all duration-300 ${activeTab === 'register' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="youremail@vit.ac.in"
                                                            {...field}
                                                            className="bg-[#1e1c29] border border-gray-700 text-white"
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
                                                            placeholder="••••••••"
                                                            {...field}
                                                            className="bg-[#1e1c29] border border-gray-700 text-white"
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
                                                                className="accent-orange-500"
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm cursor-pointer text-gray-400">Remember me</FormLabel>
                                                    </FormItem>
                                                )}
                                            />

                                            <a href="#" className="text-sm text-orange-400 hover:underline">
                                                Forgot password?
                                            </a>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold shadow-lg hover:bg-orange-600"
                                            disabled={loginMutation.isPending}
                                        >
                                            {loginMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                                        <FormField
                                            control={registerForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-300">Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="youremail@vit.ac.in"
                                                            {...field}
                                                            className="bg-[#1e1c29] border border-gray-700 text-white"
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
                                                            placeholder="Create a strong password"
                                                            {...field}
                                                            className="bg-[#1e1c29] border border-gray-700 text-white"
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                calculatePasswordStrength(e.target.value);
                                                            }}
                                                        />
                                                    </FormControl>

                                                    {/* Password strength indicator */}
                                                    <div className="mt-2 flex gap-1">
                                                        <div className={`h-1 w-1/5 rounded-full ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-[#1e1c29]'}`}></div>
                                                        <div className={`h-1 w-1/5 rounded-full ${passwordStrength >= 2 ? 'bg-red-500' : 'bg-[#1e1c29]'}`}></div>
                                                        <div className={`h-1 w-1/5 rounded-full ${passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-[#1e1c29]'}`}></div>
                                                        <div className={`h-1 w-1/5 rounded-full ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-[#1e1c29]'}`}></div>
                                                        <div className={`h-1 w-1/5 rounded-full ${passwordStrength >= 5 ? 'bg-green-500' : 'bg-[#1e1c29]'}`}></div>
                                                    </div>

                                                    {passwordStrength > 0 && (
                                                        <p className="text-xs mt-1 text-gray-400">
                                                            {passwordStrength < 3 && <span className="text-red-500">Weak</span>}
                                                            {passwordStrength === 3 && <span className="text-yellow-500">Medium</span>}
                                                            {passwordStrength > 3 && <span className="text-green-500">Strong</span>}
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
                                                            placeholder="Confirm your password"
                                                            {...field}
                                                            className="bg-[#1e1c29] border border-gray-700 text-white"
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
                                                <FormItem className="flex items-start space-x-2">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="accent-blue-500"
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-normal cursor-pointer text-gray-400">
                                                            I agree to the{" "}
                                                            <a href="#" className="text-blue-400 hover:underline">
                                                                Terms of Service
                                                            </a>{" "}
                                                            and{" "}
                                                            <a href="#" className="text-blue-400 hover:underline">
                                                                Privacy Policy
                                                            </a>
                                                        </FormLabel>
                                                        <FormMessage className="text-red-500" />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:bg-blue-600"
                                            disabled={registerMutation.isPending}
                                        >
                                            {registerMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

            {/* Right Panel - Showcase */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-[#26223a] overflow-hidden">
                <div className="w-full max-w-md bg-gradient-to-br from-orange-500 to-blue-700 p-1 rounded-2xl shadow-lg">
                    <div className="bg-[#1e1c29] rounded-2xl p-6 w-full h-full">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-6 text-white">Your Skill Growth</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1 text-gray-300">
                                        <span>Java Programming</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                        <div className="bg-orange-500 rounded-full h-2 w-[85%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-gray-300">
                                        <span>DBMS</span>
                                        <span>70%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                        <div className="bg-blue-500 rounded-full h-2 w-[70%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1 text-gray-300">
                                        <span>Web Development</span>
                                        <span>90%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                        <div className="bg-orange-500 rounded-full h-2 w-[90%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-6 text-white">Semester Progress</h2>
                            <div className="flex justify-between items-center text-white">
                                <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center text-lg font-semibold">8.7</div>
                                <div className="text-right">
                                    <p className="text-lg font-medium">CGPA: 8.75</p>
                                    <p className="text-gray-400">7 weeks remaining</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-white">Overall Attendance</h2>
                            <div className="flex items-center text-lg text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                <span>92% - Excellent</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}