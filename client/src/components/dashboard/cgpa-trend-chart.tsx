import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import { Semester, Course } from "@shared/schema";

// Define an interface that extends Semester but includes courses
interface SemesterWithCourses extends Semester {
  courses?: Course[];
}

interface CGPATrendChartProps {
  semesters: SemesterWithCourses[];
}

export default function CGPATrendChart({ semesters }: CGPATrendChartProps) {
  const getSemesterCGPA = (semester: SemesterWithCourses) => {
    if (!semester.courses || semester.courses.length === 0) return 0;
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    semester.courses.forEach((course: Course) => {
      const gradePoint = getGradePoint(course.grade);
      totalGradePoints += gradePoint * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits === 0 ? 0 : parseFloat((totalGradePoints / totalCredits).toFixed(2));
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

  const data = useMemo(() => {
    // Sort semesters by createdAt date
    const sortedSemesters = [...semesters].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    
    let cumulativeGPA = 0;
    let totalCredits = 0;
    
    return sortedSemesters.map((semester, index) => {
      const semesterGPA = getSemesterCGPA(semester);
      let totalCourseCredits = 0;
      
      if (semester.courses) {
        totalCourseCredits = semester.courses.reduce((acc: number, course: Course) => acc + course.credits, 0);
      }
      
      // Calculate cumulative GPA
      if (semesterGPA > 0) {
        cumulativeGPA = ((cumulativeGPA * totalCredits) + (semesterGPA * totalCourseCredits)) / 
          (totalCredits + totalCourseCredits);
        totalCredits += totalCourseCredits;
      }
      
      return {
        name: semester.name,
        semesterGPA,
        cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2))
      };
    });
  }, [semesters]);
  
  if (semesters.length === 0 || data.every(item => item.semesterGPA === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CGPA Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Add semester data to view your CGPA trend</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CGPA Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <ReferenceLine y={7.5} stroke="#f59e0b" strokeDasharray="3 3" label="Good" />
            <ReferenceLine y={9} stroke="#22c55e" strokeDasharray="3 3" label="Excellent" />
            <Line 
              type="monotone" 
              dataKey="semesterGPA" 
              name="Semester GPA" 
              stroke="#6366f1" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeGPA" 
              name="Cumulative GPA" 
              stroke="#ec4899" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}