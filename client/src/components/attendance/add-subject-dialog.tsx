import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertSubjectSchema, Subject } from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  attendedClasses: z.coerce.number().min(0, "Cannot be negative"),
  totalClasses: z.coerce.number().min(0, "Cannot be negative"),
}).refine(data => data.attendedClasses <= data.totalClasses, {
  message: "Attended classes cannot exceed total classes",
  path: ["attendedClasses"],
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSubject?: Subject; // For editing mode
}

export default function AddSubjectDialog({ 
  open, 
  onOpenChange, 
  existingSubject 
}: AddSubjectDialogProps) {
  const { toast } = useToast();
  const isEditMode = !!existingSubject;

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: existingSubject?.name || "",
      attendedClasses: existingSubject?.attendedClasses || 0,
      totalClasses: existingSubject?.totalClasses || 0,
    },
  });

  const addSubjectMutation = useMutation({
    mutationFn: async (data: SubjectFormValues) => {
      const response = await apiRequest("POST", "/api/subjects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      toast({
        title: "Subject added",
        description: "Your subject has been added successfully.",
      });
      form.reset({
        name: "",
        attendedClasses: 0,
        totalClasses: 0,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: async (data: SubjectFormValues) => {
      const response = await apiRequest("PUT", `/api/subjects/${existingSubject?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
      toast({
        title: "Subject updated",
        description: "Your subject has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SubjectFormValues) {
    if (isEditMode) {
      updateSubjectMutation.mutate(data);
    } else {
      addSubjectMutation.mutate(data);
    }
  }

  const isPending = addSubjectMutation.isPending || updateSubjectMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Subject" : "Add New Subject"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update your subject details and attendance records." 
              : "Add a new subject to track your attendance."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Database Systems, Machine Learning" 
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
                name="attendedClasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attended Classes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalClasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Classes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                      />
                    </FormControl>
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
                  isEditMode ? "Update Subject" : "Add Subject"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
