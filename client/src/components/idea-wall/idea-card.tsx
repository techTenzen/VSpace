import { useState } from "react";
import { Idea, User } from "@shared/schema";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

interface IdeaCardProps {
  idea: Idea & { user: User };
  onDelete?: (ideaId: number) => void;
}

export default function IdeaCard({ idea, onDelete }: IdeaCardProps) {
  const { user: currentUser } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true });
  const isOwner = currentUser?.id === idea.userId;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "VU";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
  };

  const openGmailCompose = () => {
    const to = encodeURIComponent(idea.user.email);
    const subject = encodeURIComponent(`Collaboration on ${idea.title}`);
    const body = encodeURIComponent(
        `Hi ${idea.user.fullName || 'there'},\n\nI'm ${currentUser?.fullName || 'a student'} from VIT-AP. I'm interested in collaborating on your idea about ${idea.title}. Please contact me at ${currentUser?.email || ''}.`
    );

    // Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
    setIsContactDialogOpen(false);
  };

  return (
      <div className="bg-card rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={idea.user.profilePicture || ""} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getInitials(idea.user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{idea.user ? (
                    <h3 className="font-medium">{idea.user.fullName || "Anonymous"}</h3>
                ) : (
                    <span className="text-muted-foreground">Unknown author</span>
                )}</h3>
                <p className="text-xs text-muted-foreground">{idea.user.department || "VIT-AP Student"}</p>
              </div>
            </div>
            {isOwner && onDelete && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Idea</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this idea? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                          onClick={() => onDelete(idea.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-2">{idea.title}</h2>
          <p className="text-muted-foreground mb-4">{idea.description}</p>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>

            {!isOwner && (
                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                        size="sm"
                        className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" /> Talk
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact {idea.user.fullName || "Author"}</DialogTitle>
                      <DialogDescription>
                        Send an email to discuss this idea. Preview your message below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-4">
                      <div>
                        <label className="text-sm font-medium">To</label>
                        <Input value={idea.user.email} readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <Input value={`Collaboration on ${idea.title}`} readOnly />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                            readOnly
                            value={
                              `Hi ${idea.user.fullName || 'there'},

I'm ${currentUser?.fullName || 'a student'} from VIT-AP. I'm interested in collaborating on your idea about ${idea.title}. Please contact me at ${currentUser?.email || ''}.`
                            }
                            className="h-32 resize-none"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={openGmailCompose}>
                        <Mail className="h-4 w-4 mr-2" /> Send Email
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            )}
          </div>
        </CardContent>
      </div>
  );
}