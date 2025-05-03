import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import SemesterCard from "@/components/cgpa/semester-card";
import AddSemesterDialog from "@/components/cgpa/add-semester-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Semester, Course } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CGPAPage() {
  const { user } = useAuth();
  const [isAddSemesterDialogOpen, setIsAddSemesterDialogOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | undefined>(undefined);

  const { data: semesters = [], isLoading } = useQuery<(Semester & { courses?: Course[] })[]>({
    queryKey: ["/api/semesters"],
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

  const calculateCGPA = () => {
    if (semesters.length === 0 || !semesters.some(sem => sem.courses?.length > 0)) return 0;
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    semesters.forEach(semester => {
      if (!semester.courses) return;
      
      semester.courses.forEach(course => {
        const gradePoint = getGradePoint(course.grade);
        totalGradePoints += gradePoint * course.credits;
        totalCredits += course.credits;
      });
    });
    
    return totalCredits === 0 ? 0 : (totalGradePoints / totalCredits).toFixed(2);
  };

  const getTotalCredits = () => {
    return semesters.reduce((total, semester) => {
      if (!semester.courses) return total;
      return total + semester.courses.reduce((sum, course) => sum + course.credits, 0);
    }, 0);
  };

  const getCGPATrendData = () => {
    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    
    return semesters
      .filter(semester => semester.courses && semester.courses.length > 0)
      .map((semester, index) => {
        const semesterGPA = parseFloat(calculateGPA(semester.courses || []));
        const semesterCredits = semester.courses?.reduce((sum, course) => sum + course.credits, 0) || 0;
        
        cumulativePoints += semesterGPA * semesterCredits;
        cumulativeCredits += semesterCredits;
        
        const cgpaUntilNow = cumulativeCredits === 0 ? 0 : cumulativePoints / cumulativeCredits;
        
        return {
          name: semester.name,
          GPA: semesterGPA,
          CGPA: parseFloat(cgpaUntilNow.toFixed(2)),
        };
      });
  };

  const handleAddSemester = () => {
    setSelectedSemester(undefined);
    setIsAddSemesterDialogOpen(true);
  };

  const handleEditSemester = (semester: Semester) => {
    setSelectedSemester(semester);
    setIsAddSemesterDialogOpen(true);
  };

  const cgpa = calculateCGPA();
  const totalCredits = getTotalCredits();
  const trendData = getCGPATrendData();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <MobileNav />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">CGPA Calculator</h1>
            <Button
              className="flex items-center gap-2" 
              onClick={handleAddSemester}
            >
              <PlusCircle className="h-4 w-4" /> Add Semester
            </Button>
          </div>

          {/* CGPA Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Current CGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{cgpa} <span className="text-sm font-normal text-muted-foreground">/ 10</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{totalCredits}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Semesters Recorded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{semesters.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* CGPA Trend Graph */}
          {trendData.length > 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>CGPA Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#2D2D2D", border: "1px solid #5D4A77" }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="GPA" 
                      stroke="#7E57C2" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="CGPA" 
                      stroke="#4CAF50" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Semesters List */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-7 bg-accent/20 rounded-md w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="h-5 bg-accent/10 rounded-md w-1/4"></div>
                        <div className="h-5 bg-accent/10 rounded-md w-1/4"></div>
                      </div>
                      <div className="h-36 bg-accent/5 rounded-md"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : semesters.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {semesters.map((semester) => (
                <SemesterCard 
                  key={semester.id} 
                  semester={semester} 
                  onEditSemester={handleEditSemester} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <h2 className="text-xl font-semibold mb-2">No Semesters Added Yet</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Add your first semester to start tracking your CGPA
                </p>
                <Button onClick={handleAddSemester}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add First Semester
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <AddSemesterDialog 
        open={isAddSemesterDialogOpen} 
        onOpenChange={setIsAddSemesterDialogOpen}
        existingSemester={selectedSemester}
      />
    </div>
  );
}
