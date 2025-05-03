import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  department: z.string().min(1, "Please select a department"),
  joiningYear: z.string().min(1, "Please select a year"),
});

const step2Schema = z.object({
  rollNumber: z.string().min(1, "Roll number is required"),
  gender: z.string().min(1, "Please select a gender"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Please enter a valid phone number"),
});

const step3Schema = z.object({
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      proficiency: z.number().min(1).max(5),
    })
  ).optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;
type OnboardingValues = Step1Values & Step2Values & Step3Values;

const defaultSkills = [
  { name: "Java Programming", category: "Technical", proficiency: 3 },
  { name: "Database Management", category: "Technical", proficiency: 2 },
  { name: "Web Development", category: "Technical", proficiency: 4 },
  { name: "Problem Solving", category: "Soft Skills", proficiency: 3 },
  { name: "Communication", category: "Soft Skills", proficiency: 4 },
];

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const { completeOnboardingMutation } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingValues>>({});

  // Form for Step 1
  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: "",
      department: "",
      joiningYear: "",
    },
  });

  // Form for Step 2
  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      rollNumber: "",
      gender: "",
      phoneNumber: "",
    },
  });

  // Form for Step 3
  const step3Form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      skills: defaultSkills,
    },
  });

  // Handle skill level change
  const updateSkillProficiency = (index: number, newValue: number) => {
    const currentSkills = step3Form.watch("skills") || [...defaultSkills];
    const updatedSkills = [...currentSkills];
    updatedSkills[index] = { ...updatedSkills[index], proficiency: newValue };
    step3Form.setValue("skills", updatedSkills);
  };

  // Step 1 submission
  const onSubmitStep1 = (data: Step1Values) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  // Step 2 submission
  const onSubmitStep2 = (data: Step2Values) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  // Step 3 submission
  const onSubmitStep3 = (data: Step3Values) => {
    const completeData = { ...formData, ...data };
    completeOnboardingMutation.mutate(completeData as any);
  };

  // Handle skip
  const handleSkip = () => {
    if (step === 3) {
      const completeData = { 
        ...formData, 
        skills: [] // Skip adding skills
      };
      completeOnboardingMutation.mutate(completeData as any);
    } else {
      setStep(step + 1);
    }
  };

  // Handle previous
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle dialog close
  const handleClose = (open: boolean) => {
    // Only allow closing if not loading
    if (!completeOnboardingMutation.isPending) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <span>Let's get to know you better. This information helps us personalize your experience.</span>
            <span className="text-primary font-medium">Step {step}/3</span>
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(onSubmitStep1)} className="space-y-6">
              <FormField
                control={step1Form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch/Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                control={step1Form.control}
                name="joiningYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Joining</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

              <DialogFooter className="flex justify-between">
                <div className="flex-grow"></div>
                <Button type="button" variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
                <Button type="submit">
                  Next
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {/* Step 2: Academic Info */}
        {step === 2 && (
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(onSubmitStep2)} className="space-y-6">
              <FormField
                control={step2Form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your roll number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                control={step2Form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <div className="flex-grow"></div>
                <Button type="button" variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
                <Button type="submit">
                  Next
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {/* Step 3: Skills Assessment */}
        {step === 3 && (
          <Form {...step3Form}>
            <form onSubmit={step3Form.handleSubmit(onSubmitStep3)} className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Rate your proficiency in these skills, or skip to add them later.
                </p>

                {defaultSkills.map((skill, index) => (
                  <div key={index}>
                    <FormItem>
                      <div className="flex justify-between items-baseline mb-2">
                        <FormLabel>{skill.name}</FormLabel>
                        <span className="text-sm text-muted-foreground">{step3Form.watch(`skills.${index}.proficiency`)}/5</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[step3Form.watch(`skills.${index}.proficiency`) || skill.proficiency]}
                          onValueChange={(values) => updateSkillProficiency(index, values[0])}
                        />
                      </div>
                    </FormItem>
                  </div>
                ))}
              </div>

              <DialogFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
                <div className="flex-grow"></div>
                <Button type="button" variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
                <Button 
                  type="submit" 
                  disabled={completeOnboardingMutation.isPending}
                >
                  {completeOnboardingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finishing...
                    </>
                  ) : (
                    "Finish"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
