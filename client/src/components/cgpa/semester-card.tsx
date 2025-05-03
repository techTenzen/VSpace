import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Semester, Course } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import AddSubjectDialog from "./add-subject-dialog";

interface SemesterCardProps {
  semester: Semester & { courses?: Course[] };
  onEditSemester: (semester: Semester) => void;
}

export default function SemesterCard({ semester, onEditSemester }: SemesterCardProps) {
  const { toast } = useToast();
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  const deleteCourseButtonClicked = (courseId: number) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const deleteCourseConfirmed = () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete);
    }
  };

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      await apiRequest("DELETE", `/api/courses/${courseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/semesters"] });
      toast({
        title: "Course deleted",
        description: "The course has been removed from your semester.",
      });
      setCourseToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculateGPA = (courses: Course[]) => {
    if (!courses || courses.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      const gradePoint = getGradePoint(course.grade);
      totalPoints += gradePoint * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  };

  const getGradePoint = (grade: string) => {
    const gradePoints: Record<string, number> = {
      'S': 10,
      'A': 9,
      'B': 8,
      'C': 7,
      'D': 6,
      'E': 5,
      'F': 0
    };
    
    return gradePoints[grade] || 0;
  };

  const getTotalCredits = (courses: Course[]) => {
    if (!courses || courses.length === 0) return 0;
    return courses.reduce((sum, course) => sum + course.credits, 0);
  };

  const editCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsAddSubjectDialogOpen(true);
  };

  const handleAddSubject = () => {
    setSelectedCourse(undefined);
    setIsAddSubjectDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{semester.name}</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEditSemester(semester)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddSubject}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {semester.courses && semester.courses.length > 0 ? (
          <>
            <div className="flex justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Total Credits: <span className="font-medium text-foreground">{getTotalCredits(semester.courses)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                GPA: <span className="font-medium text-foreground">{calculateGPA(semester.courses)}</span>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semester.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell className="text-center">{course.credits}</TableCell>
                      <TableCell className="text-center font-medium">{course.grade}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-8 w-8" 
                            onClick={() => editCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit course</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-8 w-8 text-destructive"
                            onClick={() => deleteCourseButtonClicked(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete course</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No courses added yet</p>
            <Button onClick={handleAddSubject}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Course
            </Button>
          </div>
        )}
      </CardContent>

      <AddSubjectDialog 
        open={isAddSubjectDialogOpen} 
        onOpenChange={setIsAddSubjectDialogOpen}
        semesterId={semester.id}
        existingCourse={selectedCourse}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteCourseConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
