import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateUserProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Check, User, Building, CalendarDays, Hash, Users, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const profileFormSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    department: z.string().min(1, "Please select a department"),
    joiningYear: z.string().min(1, "Please select a year"),
    rollNumber: z.string().min(1, "Roll number is required"),
    gender: z.string().min(1, "Please select a gender"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[0-9+\s-]+$/, "Please enter a valid phone number"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
    const { user, updateProfileMutation } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            department: user?.department || "",
            joiningYear: user?.joiningYear || "",
            rollNumber: user?.rollNumber || "",
            gender: user?.gender || "",
            phoneNumber: user?.phoneNumber || "",
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsSubmitting(true);
            await updateProfileMutation.mutateAsync(data as UpdateUserProfile);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
                variant: "success",
            });
        } catch (error) {
            console.error("Profile update error:", error);
            toast({
                title: "Update failed",
                description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "VU";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Profile picture upload handler
    const handleFileUpload = () => {
        toast({
            title: "Feature not implemented",
            description: "Profile picture upload will be available soon.",
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const avatarVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
        success: {
            backgroundColor: "#10b981",
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={avatarVariants}
                    >
                        <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                            <AvatarImage src={user?.profilePicture || ""} alt={user?.fullName || "User"} />
                            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                {getInitials(user?.fullName)}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-md"
                            onClick={handleFileUpload}
                        >
                            <Upload className="h-5 w-5" />
                            <span className="sr-only">Upload profile picture</span>
                        </Button>
                    </motion.div>
                </div>
                <motion.h2
                    className="mt-4 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {user?.fullName || "VIT Student"}
                </motion.h2>
                <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {user?.email}
                </motion.p>
            </motion.div>

            <Form {...form}>
                <motion.div
                    className="space-y-8 bg-card rounded-xl p-6 shadow-md border border-border"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem
                                    className="bg-background rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                                    onFocus={() => setActiveSection("fullName")}
                                    onBlur={() => setActiveSection(null)}
                                >
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <User className="h-4 w-4 text-primary" />
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your full name"
                                            {...field}
                                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem
                                    className="bg-background rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                                    onFocus={() => setActiveSection("department")}
                                    onBlur={() => setActiveSection(null)}
                                >
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <Building className="h-4 w-4 text-primary" />
                                        Department
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/30">
                                                <SelectValue placeholder="Select your department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="border border-primary/20">
                                            <SelectItem value="Computer Science Engineering">Computer Science Engineering</SelectItem>
                                            <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                                            <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                                            <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                                            <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                                            <SelectItem value="Business Administration">Business Administration</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="joiningYear"
                            render={({ field }) => (
                                <FormItem
                                    className="bg-background rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                                    onFocus={() => setActiveSection("joiningYear")}
                                    onBlur={() => setActiveSection(null)}
                                >
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <CalendarDays className="h-4 w-4 text-primary" />
                                        Year of Joining
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/30">
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="border border-primary/20">
                                            <SelectItem value="2023">2023</SelectItem>
                                            <SelectItem value="2022">2022</SelectItem>
                                            <SelectItem value="2021">2021</SelectItem>
                                            <SelectItem value="2020">2020</SelectItem>
                                            <SelectItem value="2019">2019</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rollNumber"
                            render={({ field }) => (
                                <FormItem
                                    className="bg-background rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                                    onFocus={() => setActiveSection("rollNumber")}
                                    onBlur={() => setActiveSection(null)}
                                >
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <Hash className="h-4 w-4 text-primary" />
                                        Roll Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your roll number"
                                            {...field}
                                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem
                                    className="bg-background rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                                    onFocus={() => setActiveSection("gender")}
                                    onBlur={() => setActiveSection(null)}
                                >
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <Users className="h-4 w-4 text-primary" />
                                        Gender
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/30">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="border border-primary/20">
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem
                                    className="bg-background rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                                    onFocus={() => setActiveSection("phoneNumber")}
                                    onBlur={() => setActiveSection(null)}
                                >
                                    <FormLabel className="flex items-center gap-2 text-base">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Phone Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your phone number"
                                            {...field}
                                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">Include country code for international numbers</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="pt-4 flex justify-end"
                    >
                        <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            animate={saveSuccess ? "success" : "idle"}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                type="submit"
                                onClick={form.handleSubmit(onSubmit)}
                                className="px-8 py-6 text-base font-medium transition-all duration-300 bg-primary/90 hover:bg-primary"
                                disabled={isSubmitting || updateProfileMutation.isPending}
                            >
                                <AnimatePresence mode="wait">
                                    {(isSubmitting || updateProfileMutation.isPending) ? (
                                        <motion.div
                                            className="flex items-center"
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </motion.div>
                                    ) : saveSuccess ? (
                                        <motion.div
                                            className="flex items-center"
                                            key="success"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Saved!
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            key="save"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Save Changes
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Form>
        </div>
    );
}