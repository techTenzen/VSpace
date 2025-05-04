import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertSkillSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
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
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const skillSchema = insertSkillSchema.extend({
  name: z.string().min(2, "Skill name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  proficiency: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSkill?: any; // For editing mode
}

export default function AddSkillDialog({ open, onOpenChange, existingSkill }: AddSkillDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditMode = !!existingSkill;
  const [sliderValue, setSliderValue] = useState(existingSkill?.proficiency || 3);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: existingSkill?.name || "",
      category: existingSkill?.category || "",
      proficiency: existingSkill?.proficiency || 3,
      notes: existingSkill?.notes || "",
    },
  });

  const addSkillMutation = useMutation({
    // FIX: Don't call .json() here - the response body can only be read once
    mutationFn: async (data: SkillFormValues) => {
      return await apiRequest("POST", "/api/skills", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
      });
      form.reset({
        name: "",
        category: "",
        proficiency: 3,
        notes: "",
      });
      onOpenChange(false);
      setSliderValue(3);
    },
    onError: (error) => {
      toast({
        title: "Failed to add skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSkillMutation = useMutation({
    // FIX: Same fix as above - don't read response body twice
    mutationFn: async (data: SkillFormValues) => {
      return await apiRequest("PUT", `/api/skills/${existingSkill.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill updated",
        description: "Your skill has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SkillFormValues) {
    if (isEditMode) {
      updateSkillMutation.mutate(data);
    } else {
      addSkillMutation.mutate(data);
    }
  }

  const isPending = addSkillMutation.isPending || updateSkillMutation.isPending;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                  ? "Update your skill proficiency and details."
                  : "Track a new skill to monitor your growth."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="e.g., Java Programming, Public Speaking"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                            <SelectItem value="Domain Knowledge">Domain Knowledge</SelectItem>
                            <SelectItem value="Languages">Languages</SelectItem>
                            <SelectItem value="Creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="proficiency"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency ({sliderValue}/5)</FormLabel>
                        <FormControl>
                          <Slider
                              min={1}
                              max={5}
                              step={0.5}
                              value={[sliderValue]}
                              onValueChange={(value) => {
                                setSliderValue(value[0]);
                                field.onChange(value[0]);
                              }}
                              className="py-4"
                          />
                        </FormControl>
                        <FormDescription>
                    <span className="flex justify-between text-xs">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                              placeholder="Add any details or notes about your skill"
                              className="h-20 resize-none"
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
                      isEditMode ? "Update Skill" : "Add Skill"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}
