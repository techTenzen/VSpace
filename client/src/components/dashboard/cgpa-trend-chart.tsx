import React, { useState, useEffect, useMemo } from "react";
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
import { motion } from "framer-motion";

// Define an interface that extends Semester but includes courses
interface SemesterWithCourses extends Semester {
  courses?: Course[];
}

interface CGPATrendChartProps {
  semesters: SemesterWithCourses[];
}

export default function CGPATrendChart({ semesters }: CGPATrendChartProps) {
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    // Animate chart appearance
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
        cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)),
        credits: totalCourseCredits
      };
    });
  }, [semesters]);

  const getGradeColor = (value: number) => {
    if (value >= 9) return "#22c55e"; // Green for excellent
    if (value >= 8) return "#3b82f6"; // Blue for very good
    if (value >= 7) return "#6366f1"; // Indigo for good
    if (value >= 6) return "#f59e0b"; // Amber for satisfactory
    return "#ef4444"; // Red for needs improvement
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const semData = payload[0].payload;
      return (
          <div className="bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border">
            <p className="font-semibold text-foreground">{label}</p>
            <div className="space-y-1 mt-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Semester GPA:</span>{" "}
                <span className="font-medium" style={{ color: getGradeColor(semData.semesterGPA) }}>
                {semData.semesterGPA.toFixed(2)}
              </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">CGPA:</span>{" "}
                <span className="font-medium" style={{ color: getGradeColor(semData.cumulativeGPA) }}>
                {semData.cumulativeGPA.toFixed(2)}
              </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Credits:</span>{" "}
                <span className="font-medium">{semData.credits}</span>
              </p>
            </div>
          </div>
      );
    }
    return null;
  };

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

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

  const currentCGPA = data.length > 0 ? data[data.length - 1].cumulativeGPA : 0;
  const previousCGPA = data.length > 1 ? data[data.length - 2].cumulativeGPA : 0;

  return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>CGPA Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current CGPA</h4>
                <p className="text-2xl font-bold" style={{ color: getGradeColor(currentCGPA) }}>
                  {currentCGPA.toFixed(2)}/10
                </p>
              </div>

              <div className="flex items-center gap-6 mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">CGPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-xs text-muted-foreground">Semester GPA</span>
                </div>
              </div>
            </div>

            <motion.div
                initial="hidden"
                animate={showChart ? "visible" : "hidden"}
                variants={chartVariants}
                className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                  />
                  <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      tickCount={6}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Reference lines for grade benchmarks */}
                  <ReferenceLine y={9} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Excellent', position: 'insideLeft', style: { fontSize: 10, fill: '#22c55e' } }} />
                  <ReferenceLine y={8} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Very Good', position: 'insideLeft', style: { fontSize: 10, fill: '#3b82f6' } }} />
                  <ReferenceLine y={7} stroke="#6366f1" strokeDasharray="3 3" label={{ value: 'Good', position: 'insideLeft', style: { fontSize: 10, fill: '#6366f1' } }} />
                  <ReferenceLine y={6} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Pass', position: 'insideLeft', style: { fontSize: 10, fill: '#f59e0b' } }} />

                  {/* Semester GPA Line */}
                  <Line
                      type="monotone"
                      dataKey="semesterGPA"
                      name="Semester GPA"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#a855f7", strokeWidth: 1, stroke: "#a855f7" }}
                      activeDot={{ r: 6, fill: "#a855f7", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1500}
                      isAnimationActive={true}
                  />

                  {/* CGPA Line - Animated and styled */}
                  <Line
                      type="monotone"
                      dataKey="cumulativeGPA"
                      name="Cumulative GPA"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 7, fill: "#7c3aed", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={2000}
                      isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Performance insights */}
            {data.length > 1 && (
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <p className="text-sm">
                    {currentCGPA > previousCGPA
                        ? "📈 Your CGPA is improving! Keep up the good work."
                        : currentCGPA < previousCGPA
                            ? "📉 Your CGPA has decreased slightly. Consider focusing more on your studies."
                            : "📊 Your CGPA is stable. Maintain your performance consistency."
                    }
                  </p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
  );
}