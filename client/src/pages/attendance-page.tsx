import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import SubjectRow from "@/components/attendance/subject-row";
import AddSubjectDialog from "@/components/attendance/add-subject-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Subject } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Plus, AlertTriangle } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(undefined);

  const { data: subjects = [], isLoading } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
    meta: {
      errorMessage: "Failed to load subjects"
    },
  });

  const calculateOverallAttendance = () => {
    if (subjects.length === 0) return 0;
    
    const totalAttended = subjects.reduce((acc, subject) => acc + subject.attendedClasses, 0);
    const totalClasses = subjects.reduce((acc, subject) => acc + subject.totalClasses, 0);
    
    return totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);
  };

  const overallAttendance = calculateOverallAttendance();

  const getAttendanceStatusClass = (percentage: number) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-destructive";
  };

  const getAttendanceStatusText = (percentage: number) => {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 75) return "Good";
    return "Warning";
  };

  const chartData = subjects.map((subject) => {
    const percentage = subject.totalClasses === 0 
      ? 0 
      : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
    
    return {
      name: subject.name,
      value: percentage,
      attendance: `${subject.attendedClasses}/${subject.totalClasses}`,
    };
  });

  const COLORS = ['bg-primary', '#4CAF50', 'bg-accent', 'bg-destructive', '#2196F3', '#673AB7', '#009688'];

  const handleAddSubject = () => {
    setSelectedSubject(undefined);
    setIsAddDialogOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsAddDialogOpen(true);
  };

  // Subjects that are at risk (below 75%)
  const atRiskSubjects = subjects.filter((subject) => {
    const percentage = subject.totalClasses === 0 
      ? 0 
      : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
    
    return percentage < 75;
  });

  // Calculate how many classes need to be attended to reach 75%
  const calculateClassesNeeded = (subject: Subject) => {
    const currentPercentage = subject.totalClasses === 0 
      ? 0 
      : (subject.attendedClasses / subject.totalClasses) * 100;
    
    if (currentPercentage >= 75) return 0;
    
    // Formula: (0.75 * totalClasses - attendedClasses) / 0.25
    const totalWithCurrent = subject.totalClasses;
    const needed = Math.ceil((0.75 * totalWithCurrent - subject.attendedClasses) / 0.25);
    
    return needed;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <MobileNav />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Attendance Tracker</h1>
            <Button
              className="flex items-center gap-2" 
              onClick={handleAddSubject}
            >
              <Plus className="h-4 w-4" /> Add Subject
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Overall Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold flex items-center">
                    <span className={getAttendanceStatusClass(overallAttendance)}>
                      {overallAttendance}%
                    </span>
                    <span className="text-sm font-normal ml-2 text-muted-foreground">
                      {getAttendanceStatusText(overallAttendance)}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center"
                    style={{ 
                      borderColor: overallAttendance >= 85 
                        ? '#4CAF50' 
                        : overallAttendance >= 75 
                          ? 'bg-accent' 
                          : 'bg-destructive' 
                    }}
                  >
                    {overallAttendance}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{subjects.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {subjects.reduce((acc, subject) => acc + subject.totalClasses, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Classes Attended</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {subjects.reduce((acc, subject) => acc + subject.attendedClasses, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-10 bg-accent/20 rounded-md mb-4"></div>
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-accent/10 rounded-md"></div>
                        ))}
                      </div>
                    </div>
                  ) : subjects.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <table className="min-w-full divide-y divide-muted">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="py-3 px-4 text-left">Subject</th>
                            <th className="py-3 px-4 text-center">Classes</th>
                            <th className="py-3 px-4 text-center">Percentage</th>
                            <th className="py-3 px-4 text-center">Mark</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-muted">
                          {subjects.map((subject) => (
                            <SubjectRow 
                              key={subject.id} 
                              subject={subject} 
                              onEdit={handleEditSubject} 
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No subjects added yet</p>
                      <Button onClick={handleAddSubject}>
                        <Plus className="h-4 w-4 mr-2" /> Add Your First Subject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Attendance visualization */}
            <div className="lg:col-span-1 space-y-6">
              {subjects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any, props: any) => {
                            return [`${value}% (${props.payload.attendance})`, name];
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {atRiskSubjects.length > 0 && (
                <Card className="border-destructive/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                      Attendance Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {atRiskSubjects.map((subject) => {
                        const percentage = subject.totalClasses === 0 
                          ? 0 
                          : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
                        
                        const classesNeeded = calculateClassesNeeded(subject);
                        
                        return (
                          <div key={subject.id} className="border-b border-muted pb-3 last:border-0 last:pb-0">
                            <div className="font-medium">{subject.name}</div>
                            <div className="text-sm text-destructive">
                              Current: {percentage}% ({subject.attendedClasses}/{subject.totalClasses})
                            </div>
                            <div className="text-sm mt-1">
                              Need to attend <span className="font-medium">{classesNeeded}</span> more consecutive classes to reach 75%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <AddSubjectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        existingSubject={selectedSubject}
      />
    </div>
  );
}
