import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import ProfileForm from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, Skill, Subject } from "@shared/schema";
import { AlertTriangle, Calendar, ChartLine, GraduationCap, Lightbulb, User } from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/subjects"],
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    
    const fields = [
      user.fullName,
      user.department,
      user.joiningYear,
      user.rollNumber,
      user.gender,
      user.phoneNumber,
      user.profilePicture,
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <MobileNav />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your profile information
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Activity
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <span className="text-sm mr-2">Profile Completion:</span>
                <div className="w-32 h-2 bg-secondary rounded-full">
                  <div 
                    className="h-2 rounded-full bg-primary" 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <span className="text-sm ml-2">{profileCompletion}%</span>
              </div>
            </div>

            <TabsContent value="profile">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Statistics */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ChartLine className="h-5 w-5 text-primary mr-2" />
                          <span>Skills Tracked</span>
                        </div>
                        <span className="font-medium">{skills.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                          <span>Subjects Monitored</span>
                        </div>
                        <span className="font-medium">{subjects.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-primary mr-2" />
                          <span>CGPA Tracked</span>
                        </div>
                        <span className="font-medium">Yes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Lightbulb className="h-5 w-5 text-primary mr-2" />
                          <span>Ideas Shared</span>
                        </div>
                        <span className="font-medium">
                          {activities.filter(a => a.type === "idea").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities.length > 0 ? (
                      <div className="space-y-4">
                        {activities.slice(0, 5).map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              {activity.type === "skill" && <ChartLine className="h-4 w-4 text-primary" />}
                              {activity.type === "attendance" && <Calendar className="h-4 w-4 text-primary" />}
                              {activity.type === "gpa" && <GraduationCap className="h-4 w-4 text-primary" />}
                              {activity.type === "idea" && <Lightbulb className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                              <p className="text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.createdAt).toLocaleDateString()} · 
                                {new Date(activity.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Email Address</span>
                        <span className="text-muted-foreground">{user?.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Account Created</span>
                        <span className="text-muted-foreground">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Updated</span>
                        <span className="text-muted-foreground">
                          {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings & Alerts */}
                {subjects.length > 0 && subjects.some(subject => {
                  const percentage = subject.totalClasses === 0 
                    ? 0 
                    : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
                  return percentage < 75;
                }) && (
                  <Card className="h-fit border-destructive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                        Warnings & Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {subjects.filter(subject => {
                          const percentage = subject.totalClasses === 0 
                            ? 0 
                            : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
                          return percentage < 75;
                        }).map(subject => {
                          const percentage = subject.totalClasses === 0 
                            ? 0 
                            : Math.round((subject.attendedClasses / subject.totalClasses) * 100);
                          
                          return (
                            <div key={subject.id} className="p-3 bg-destructive/10 rounded-md">
                              <div className="font-medium flex items-center">
                                <Calendar className="h-4 w-4 text-destructive mr-2" />
                                {subject.name} Attendance Alert
                              </div>
                              <p className="text-sm mt-1">
                                Current attendance is <span className="font-medium text-destructive">{percentage}%</span> - 
                                below the required 75%
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
