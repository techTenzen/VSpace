import React, { useState, useEffect, useMemo } from "react";
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
  Cell,
  LabelList
} from "recharts";
import { Subject } from "@shared/schema";
import { motion } from "framer-motion";

interface AttendanceAnalyticsChartProps {
  subjects: Subject[];
}

export default function AttendanceAnalyticsChart({ subjects }: AttendanceAnalyticsChartProps) {
  const [selectedView, setSelectedView] = useState<"percentage" | "classes">("percentage");
  const [showChart, setShowChart] = useState(false);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [riskSubjects, setRiskSubjects] = useState<any[]>([]);

  useEffect(() => {
    // Calculate average attendance
    if (subjects && subjects.length > 0) {
      const totalAttended = subjects.reduce((acc, subj) => acc + subj.attendedClasses, 0);
      const totalClasses = subjects.reduce((acc, subj) => acc + subj.totalClasses, 0);
      const avgAttendance = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);
      setAverageAttendance(avgAttendance);

      // Find subjects at risk
      const atRiskSubjects = processedData.filter(subject => subject.attendancePercentage < 75);
      setRiskSubjects(atRiskSubjects);
    }

    // Animate chart appearance
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [subjects]);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return "excellent";
    if (percentage >= 75) return "good";
    if (percentage >= 65) return "warning";
    return "critical";
  };

  const processedData = useMemo(() => {
    return subjects.map(subject => {
      const percentage = subject.totalClasses === 0
          ? 0
          : Math.round((subject.attendedClasses / subject.totalClasses) * 100);

      const classesNeededFor75 = subject.totalClasses === 0
          ? 0
          : Math.ceil((0.75 * subject.totalClasses - subject.attendedClasses) / 0.25);

      const classesNeededFor85 = subject.totalClasses === 0
          ? 0
          : Math.ceil((0.85 * subject.totalClasses - subject.attendedClasses) / 0.15);

      const shortName = subject.name.split(' ').map(word => word.charAt(0)).join('');

      return {
        name: subject.name,
        shortName,
        attendancePercentage: percentage,
        classesNeededFor75: percentage < 75 ? classesNeededFor75 : 0,
        classesNeededFor85: percentage < 85 ? classesNeededFor85 : 0,
        attended: subject.attendedClasses,
        missed: subject.totalClasses - subject.attendedClasses,
        total: subject.totalClasses,
        status: getAttendanceStatus(percentage)
      };
    }).sort((a, b) => a.attendancePercentage - b.attendancePercentage); // Sort by attendance (ascending)
  }, [subjects]);

  // Get status based on attendance percentage


  // Get color based on attendance status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "#22c55e"; // Green
      case "good": return "#3b82f6"; // Blue
      case "warning": return "#f59e0b"; // Amber
      case "critical": return "#ef4444"; // Red
      default: return "#94a3b8"; // Gray
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const subject = payload[0].payload;
      return (
          <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-border">
            <p className="font-semibold text-foreground mb-2">{subject.name}</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Attendance:</span>{" "}
                <span className="font-medium" style={{ color: getStatusColor(subject.status) }}>
                {subject.attendancePercentage}%
              </span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Classes attended:</span>{" "}
                <span className="font-medium">{subject.attended}/{subject.total}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Classes missed:</span>{" "}
                <span className="font-medium">{subject.missed}</span>
              </p>
              {subject.classesNeededFor75 > 0 && (
                  <p className="text-sm font-medium mt-2" style={{ color: "#f59e0b" }}>
                    Need to attend next {subject.classesNeededFor75} classes to reach 75%
                  </p>
              )}
              {subject.classesNeededFor75 === 0 && subject.classesNeededFor85 > 0 && (
                  <p className="text-sm font-medium mt-2" style={{ color: "#22c55e" }}>
                    Need {subject.classesNeededFor85} more classes for 85% (excellent)
                  </p>
              )}
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

  // Animation delays for each bar
  const getAnimationDelay = (index: number) => 100 + (index * 100);

  const getAttendanceStatusClass = (percentage: number) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-blue-500";
    return "text-destructive";
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
        <CardHeader className="pb-0">
          <CardTitle>Attendance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Overall Attendance</h4>
                <p className={`text-2xl font-bold ${getAttendanceStatusClass(averageAttendance)}`}>
                  {averageAttendance}%
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button
                    onClick={() => setSelectedView("percentage")}
                    className={`text-xs px-3 py-1 rounded-md transition-colors ${
                        selectedView === "percentage"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                >
                  Percentage
                </button>
                <button
                    onClick={() => setSelectedView("classes")}
                    className={`text-xs px-3 py-1 rounded-md transition-colors ${
                        selectedView === "classes"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                >
                  Classes
                </button>
              </div>
            </div>

            <motion.div
                initial="hidden"
                animate={showChart ? "visible" : "hidden"}
                variants={chartVariants}
                className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                {selectedView === "percentage" ? (
                    <BarChart
                        data={processedData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        barSize={24}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} vertical={false} />
                      <XAxis
                          dataKey="shortName"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                      />
                      <YAxis
                          domain={[0, 100]}
                          tickCount={6}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          unit="%"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={75} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Min Required (75%)', position: 'insideBottomRight', style: { fontSize: 10, fill: '#f59e0b' } }} />
                      <ReferenceLine y={85} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Excellent (85%)', position: 'insideTopRight', style: { fontSize: 10, fill: '#22c55e' } }} />
                      <Bar
                          dataKey="attendancePercentage"
                          name="Attendance"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                          isAnimationActive={true}
                      >
                        {processedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getStatusColor(entry.status)}
                                fillOpacity={0.9}
                            />
                        ))}
                        <LabelList dataKey="attendancePercentage" position="top" formatter={(value: number) => `${value}%`} style={{ fontSize: 10, fill: '#6b7280' }} />
                      </Bar>
                    </BarChart>
                ) : (
                    <BarChart
                        data={processedData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        barSize={24}
                        stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} vertical={false} />
                      <XAxis
                          dataKey="shortName"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                      />
                      <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                          dataKey="attended"
                          stackId="a"
                          fill="#22c55e"
                          name="Attended"
                          radius={[4, 0, 0, 4]}
                          animationDuration={1500}
                          isAnimationActive={true}
                      >
                        <LabelList dataKey="attended" position="center" style={{ fontSize: 10, fill: '#ffffff', fontWeight: 'bold' }} />
                      </Bar>
                      <Bar
                          dataKey="missed"
                          stackId="a"
                          fill="#ef4444"
                          name="Missed"
                          radius={[0, 4, 4, 0]}
                          animationDuration={1500}
                          isAnimationActive={true}
                      >
                        <LabelList dataKey="missed" position="center" style={{ fontSize: 10, fill: '#ffffff', fontWeight: 'bold' }} />
                      </Bar>
                    </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>

            {/* Attendance insights */}
            {riskSubjects.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-900/30"
                >
                  <p className="text-sm text-red-800 dark:text-red-300">
                    ⚠️ <span className="font-medium">Warning:</span> You're below 75% attendance in{" "}
                    {riskSubjects.length === 1
                        ? <span className="font-semibold">{riskSubjects[0].name}</span>
                        : <span className="font-semibold">{riskSubjects.length} subjects</span>
                    }.
                    {riskSubjects.length === 1
                        ? ` Need to attend the next ${riskSubjects[0].classesNeededFor75} classes to reach minimum requirement.`
                        : ` Check details to see required attendance.`
                    }
                  </p>
                </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
  );
}