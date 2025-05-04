import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertCourseSchema, Course } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogClose,
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
import { Loader2 } from "lucide-react";

const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  credits: z.coerce.number().min(1, "Credits must be at least 1").max(10, "Credits cannot exceed 10"),
  grade: z.string().refine((val) => ["S", "A", "B", "C", "D", "E", "F"].includes(val), {
    message: "Grade must be one of: S, A, B, C, D, E, F",
  }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId: number;
  existingCourse?: Course; // For editing mode
}

export default function AddSubjectDialog({ 
  open, 
  onOpenChange, 
  semesterId,
  existingCourse 
}: AddSubjectDialogProps) {
  const { toast } = useToast();
  const isEditMode = !!existingCourse;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: existingCourse?.name || "",
      credits: existingCourse?.credits || 3,
      grade: existingCourse?.grade || "A",
    },
  });

  const addCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      const courseData = { ...data, semesterId };
      const response = await apiRequest("POST", `/api/semesters/${semesterId}/courses`, courseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semesters"] });
      toast({
        title: "Course added",
        description: "Your course has been added successfully.",
      });
      form.reset({
        name: "",
        credits: 3,
        grade: "A",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      const courseData = { ...data, semesterId };
      const response = await apiRequest("PUT", `/api/courses/${existingCourse?.id}`, courseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semesters"] });
      toast({
        title: "Course updated",
        description: "Your course has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: CourseFormValues) {
    if (isEditMode) {
      updateCourseMutation.mutate(data);
    } else {
      addCourseMutation.mutate(data);
    }
  }

  const isPending = addCourseMutation.isPending || updateCourseMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update your course details and grade." 
              : "Add a new course to your semester."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Data Structures, Machine Learning" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        max="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="S">S (10 points)</SelectItem>
                        <SelectItem value="A">A (9 points)</SelectItem>
                        <SelectItem value="B">B (8 points)</SelectItem>
                        <SelectItem value="C">C (7 points)</SelectItem>
                        <SelectItem value="D">D (6 points)</SelectItem>
                        <SelectItem value="E">E (5 points)</SelectItem>
                        <SelectItem value="F">F (0 points)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {isEditMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditMode ? "Update Course" : "Add Course"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
