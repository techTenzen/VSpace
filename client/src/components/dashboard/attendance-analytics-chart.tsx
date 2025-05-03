import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine, 
  Legend
} from "recharts";
import { Subject } from "@shared/schema";

interface AttendanceAnalyticsChartProps {
  subjects: Subject[];
}

export default function AttendanceAnalyticsChart({ subjects }: AttendanceAnalyticsChartProps) {
  const data = subjects.map(subject => {
    const percentage = subject.totalClasses === 0 
      ? 0 
      : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
    
    const classesNeededFor75 = subject.totalClasses === 0 
      ? 0 
      : Math.ceil((0.75 * subject.totalClasses - subject.attendedClasses) / 0.25);
      
    const classesNeededFor85 = subject.totalClasses === 0 
      ? 0 
      : Math.ceil((0.85 * subject.totalClasses - subject.attendedClasses) / 0.15);
    
    return {
      name: subject.name,
      attendancePercentage: percentage,
      classesNeededFor75: percentage < 75 ? classesNeededFor75 : 0,
      classesNeededFor85: percentage < 85 ? classesNeededFor85 : 0,
      status: percentage >= 85 ? "Excellent" : percentage >= 75 ? "Good" : "At Risk"
    };
  });
  
  const getBarFill = (percentage: number) => {
    if (percentage >= 85) return "#22c55e"; // green
    if (percentage >= 75) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };
  
  if (subjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Add subjects to view attendance analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Analytics</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "attendancePercentage") return [`${value}%`, "Attendance"];
                if (name === "classesNeededFor75") return [value, "Classes needed for 75%"];
                if (name === "classesNeededFor85") return [value, "Classes needed for 85%"];
                return [value, name];
              }}
            />
            <Legend />
            <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="3 3" label="Minimum Required (75%)" />
            <ReferenceLine y={85} stroke="#22c55e" strokeDasharray="3 3" label="Target (85%)" />
            <Bar 
              dataKey="attendancePercentage" 
              name="Attendance" 
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}