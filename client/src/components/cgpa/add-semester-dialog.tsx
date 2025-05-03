import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertSemesterSchema, Semester } from "@shared/schema";
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

const semesterSchema = z.object({
  name: z.string().min(2, "Semester name must be at least 2 characters"),
});

type SemesterFormValues = z.infer<typeof semesterSchema>;

interface AddSemesterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSemester?: Semester; // For editing mode
}

export default function AddSemesterDialog({ 
  open, 
  onOpenChange, 
  existingSemester 
}: AddSemesterDialogProps) {
  const { toast } = useToast();
  const isEditMode = !!existingSemester;

  const form = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: existingSemester?.name || "",
    },
  });

  const addSemesterMutation = useMutation({
    mutationFn: async (data: SemesterFormValues) => {
      const response = await apiRequest("POST", "/api/semesters", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semesters"] });
      toast({
        title: "Semester added",
        description: "Your semester has been added successfully.",
      });
      form.reset({
        name: "",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add semester",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // This would need to be implemented on the backend
  const updateSemesterMutation = useMutation({
    mutationFn: async (data: SemesterFormValues) => {
      // Assuming there's an endpoint for updating semester
      const response = await apiRequest("PUT", `/api/semesters/${existingSemester?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semesters"] });
      toast({
        title: "Semester updated",
        description: "Your semester has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update semester",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SemesterFormValues) {
    if (isEditMode) {
      updateSemesterMutation.mutate(data);
    } else {
      addSemesterMutation.mutate(data);
    }
  }

  const isPending = addSemesterMutation.isPending || updateSemesterMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Semester" : "Add New Semester"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Update your semester details." 
              : "Add a new semester to track your GPA."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Fall 2023, Semester 3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  isEditMode ? "Update Semester" : "Add Semester"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
