import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Subject } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, Archive } from "lucide-react";

interface SubjectRowProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
}

export default function SubjectRow({ subject, onEdit }: SubjectRowProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  
  const attendedPercentage = subject.totalClasses === 0 
    ? 0 
    : Math.round((subject.attendedClasses / subject.totalClasses) * 100);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-destructive";
  };

  const markAttendanceMutation = useMutation({
    mutationFn: async ({ id, attended }: { id: number; attended: boolean }) => {
      const response = await apiRequest("PATCH", `/api/subjects/${id}/attendance`, { attended });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update attendance",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/subjects/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Subject deleted",
        description: "The subject has been removed from your list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const archiveSubjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/subjects/${id}/archive`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subject archived",
        description: "The subject has been archived successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subjects"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to archive subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAttendance = (attended: boolean) => {
    markAttendanceMutation.mutate({ id: subject.id, attended });
  };

  return (
    <tr className="border-b border-muted">
      <td className="py-4 px-4">{subject.name}</td>
      <td className="py-4 px-4 text-center">
        {subject.attendedClasses} / {subject.totalClasses}
      </td>
      <td className={`py-4 px-4 text-center font-medium ${getStatusColor(attendedPercentage)}`}>
        {attendedPercentage}%
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-1 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="border-green-500/30 hover:bg-green-500/10 text-green-500"
            onClick={() => handleAttendance(true)}
            disabled={markAttendanceMutation.isPending}
          >
            Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/30 hover:bg-destructive/10 text-destructive"
            onClick={() => handleAttendance(false)}
            disabled={markAttendanceMutation.isPending}
          >
            Absent
          </Button>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-8 w-8" 
            onClick={() => onEdit(subject)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit subject</span>
          </Button>
          
          <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive subject</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive this subject?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will archive "{subject.name}" and remove it from your active subjects list. You can still view it in the archives.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => archiveSubjectMutation.mutate(subject.id)}
                >
                  Archive
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete subject</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the subject "{subject.name}" and all attendance records associated with it. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteSubjectMutation.mutate(subject.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}
