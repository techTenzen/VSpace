import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import FeatureCard from "@/components/dashboard/feature-card";
import ActivityItem from "@/components/dashboard/activity-item";
import CGPATrendChart from "@/components/dashboard/cgpa-trend-chart";
import AttendanceAnalyticsChart from "@/components/dashboard/attendance-analytics-chart";
import { Button } from "@/components/ui/button";
import OnboardingDialog from "@/components/onboarding/onboarding-dialog";
import { Activity, Skill, Subject, Semester, Course } from "@shared/schema";
import { ChartLine, CalendarCheck, GraduationCap, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import {apiRequest} from "@/lib/queryClient.ts";

export default function DashboardPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    queryFn: () => apiRequest("GET", "/api/skills"),
    enabled: !!user?.isOnboardingComplete,
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
    queryFn: () => apiRequest("GET", "/api/subjects"),
    enabled: !!user?.isOnboardingComplete,
  });

  type SemesterWithCourses = Semester & { courses?: Course[] };

  const { data: semesters = [] } = useQuery<SemesterWithCourses[]>({
    queryKey: ["/api/semesters"],
    queryFn: () => apiRequest("GET", "/api/semesters"),
    enabled: !!user?.isOnboardingComplete,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    queryFn: () => apiRequest("GET", "/api/activities"),
    enabled: !!user?.isOnboardingComplete,
  });

  useEffect(() => {
    if (user && !user.isOnboardingComplete) {
      setShowOnboarding(true);
    }
  }, [user]);

  const calculateAverageSkillLevel = () => {
    if (skills.length === 0) return 0;
    const sum = skills.reduce((acc, skill) => acc + skill.proficiency, 0);
    return (sum / skills.length).toFixed(1);
  };

  const calculateOverallAttendance = () => {
    if (subjects.length === 0) return 0;
    const totalAttended = subjects.reduce((acc, subject) => acc + subject.attendedClasses, 0);
    const totalClasses = subjects.reduce((acc, subject) => acc + subject.totalClasses, 0);
    return totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);
  };

  const calculateCGPA = () => {
    if (semesters.length === 0) return 0;
    const hasAnyCourses = semesters.some(sem => sem.courses && sem.courses.length > 0);
    if (!hasAnyCourses) return 0;
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
    return totalCredits === 0 ? 0 : (totalGradePoints / totalCredits).toFixed(1);
  };

  const getGradePoint = (grade: string) => {
    const gradePoints: Record<string, number> = {
      'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0
    };
    return gradePoints[grade] || 0;
  };

  const getAttendanceStatusClass = (percentage: number) => {
    if (percentage >= 85) return "text-green-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-destructive";
  };

  return (
      <div className="flex flex-col md:flex-row min-h-screen bg-muted/50">
        <SidebarNav />
        <div className="flex-1">
          <MobileNav />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-3xl font-bold mb-1">Welcome back, <span className="text-primary">{user?.fullName || "Student"}</span>!</h1>
              <p className="text-muted-foreground mb-6">Here's a summary of your progress and activities.</p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              <FeatureCard
                  title="Skills"
                  subtitle={`${skills.length} skills tracked`}
                  icon={<ChartLine className="h-6 w-6 text-primary" />}
                  value={`${calculateAverageSkillLevel()}/5`}
                  percentage={Number(calculateAverageSkillLevel()) * 20}
                  link="/skills"
              />
              <FeatureCard
                  title="Attendance"
                  subtitle={`${subjects.length} subjects tracked`}
                  icon={<CalendarCheck className="h-6 w-6 text-primary" />}
                  value={`${calculateOverallAttendance()}%`}
                  percentage={calculateOverallAttendance()}
                  valueClassName={getAttendanceStatusClass(calculateOverallAttendance())}
                  progressClassName={
                    calculateOverallAttendance() >= 85 ? "bg-green-500" :
                        calculateOverallAttendance() >= 75 ? "bg-yellow-500" : "bg-destructive"
                  }
                  link="/attendance"
              />
              <FeatureCard
                  title="CGPA"
                  subtitle={`${semesters.length} semesters recorded`}
                  icon={<GraduationCap className="h-6 w-6 text-primary" />}
                  value={`${calculateCGPA()}/10`}
                  percentage={Number(calculateCGPA()) * 10}
                  link="/cgpa"
              />
              <FeatureCard
                  title="Idea Wall"
                  subtitle="Share and explore ideas"
                  icon={<Lightbulb className="h-6 w-6 text-primary" />}
                  text={activities.find(a => a.type === 'idea')?.description || "No ideas shared yet"}
                  link="/idea-wall"
              />
            </motion.div>

            {/* Charts */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <CGPATrendChart semesters={semesters} />
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Attendance Analytics</h3>
                <AttendanceAnalyticsChart subjects={subjects} />
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div layout className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              {activitiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-start space-x-4 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-accent/30"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-accent/30 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-accent/30 rounded w-1/2"></div>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.slice(0, 4).map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
              ) : (
                  <p className="text-muted-foreground">No recent activities to display.</p>
              )}

            </motion.div>
          </main>
        </div>
        <OnboardingDialog open={showOnboarding} onOpenChange={setShowOnboarding} />
      </div>
  );
}
