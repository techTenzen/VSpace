import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertIdeaSchema, Idea, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Define the IdeaWithUser type that was missing
type IdeaWithUser = Idea & {
  user: User;
  _optimistic?: boolean;
};

const ideaSchema = insertIdeaSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must not exceed 500 characters"),
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface ShareIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareIdeaDialog({ open, onOpenChange }: ShareIdeaDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth(); // Added this missing import

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const shareIdeaMutation = useMutation({
    mutationFn: async (data: IdeaFormValues) => {
      const response = await apiRequest("POST", "/api/ideas", data);
    },
    onMutate: async (newIdea) => {
      await queryClient.cancelQueries({ queryKey: ["/api/ideas"] });

      const previousIdeas = queryClient.getQueryData<IdeaWithUser[]>(["/api/ideas"]);

      // Only proceed with optimistic update if user exists
      if (user) {
        queryClient.setQueryData<IdeaWithUser[]>(["/api/ideas"], (old = []) => [
          {
            ...newIdea,
            id: Date.now(), // Temporary ID for optimistic update
            userId: user.id,
            createdAt: new Date().toISOString(),
            user: {
              id: user.id,
              fullName: user.fullName || 'You',
              email: user.email || '',
              department: user.department || 'VIT-AP'
            },
            _optimistic: true // Flag for rollback
          },
          ...old
        ]);
      }

      return { previousIdeas };
    },
    onError: (err, _, context) => {
      toast({
        title: "Failed to share idea",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });

      // Restore previous data on error
      if (context?.previousIdeas) {
        queryClient.setQueryData(["/api/ideas"], context.previousIdeas);
      }
    },
    onSettled: () => {
      // Always invalidate and refetch after mutation completes
      queryClient.invalidateQueries({
        queryKey: ["/api/ideas"],
      });
    },
    onSuccess: () => {
      toast({ title: "Idea shared", description: "Your idea is now visible!" });
      form.reset();
      onOpenChange(false);
    }
  });

  function onSubmit(data: IdeaFormValues) {
    shareIdeaMutation.mutate(data);
  }

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Your Idea</DialogTitle>
            <DialogDescription>
              Share your innovative ideas with the VIT-AP community.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Give your idea a catchy title"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                              placeholder="Describe your idea in a few sentences"
                              className="h-32 resize-none"
                              {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between">
                          <FormMessage />
                          <p className={`text-xs ${field.value.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {field.value.length}/500
                          </p>
                        </div>
                      </FormItem>
                  )}
              />

              <div className="bg-accent/10 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{form.watch("title") || "Your Idea Title"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("description") || "Your idea description will appear here."}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={shareIdeaMutation.isPending}>
                  {shareIdeaMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sharing...
                      </>
                  ) : (
                      "Share Idea"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}