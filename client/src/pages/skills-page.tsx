import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import SkillCard from "@/components/skills/skill-card";
import AddSkillDialog from "@/components/skills/add-skill-dialog";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Skill } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";

export default function SkillsPage() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("proficiency");

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (skillId: number) => {
      await apiRequest("DELETE", `/api/skills/${skillId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
  });

  const getCategoryCounts = () => {
    const categories: Record<string, number> = {};
    
    skills.forEach((skill) => {
      if (!categories[skill.category]) {
        categories[skill.category] = 0;
      }
      categories[skill.category]++;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#7E57C2', '#4CAF50', '#FF9800', '#F44336', '#2196F3'];

  const filteredSkills = skills
    .filter((skill) => filterCategory === "all" || skill.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "proficiency") return b.proficiency - a.proficiency;
      if (sortBy === "proficiency-asc") return a.proficiency - b.proficiency;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return 0;
    });

  const categories = Array.from(new Set(skills.map((skill) => skill.category)));

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <MobileNav />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Skill Tracker</h1>
            <Button
              className="flex items-center gap-2" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Skill
            </Button>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterCategory === "all" ? "default" : "outline"}
                className={filterCategory === "all" ? "" : "bg-secondary text-muted-foreground hover:bg-accent/20"}
                onClick={() => setFilterCategory("all")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  className={filterCategory === category ? "" : "bg-secondary text-muted-foreground hover:bg-accent/20"}
                  onClick={() => setFilterCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <select
              className="px-4 py-2 rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="proficiency">Sort by: Proficiency (High to Low)</option>
              <option value="proficiency-asc">Sort by: Proficiency (Low to High)</option>
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="name-desc">Sort by: Name (Z-A)</option>
              <option value="recent">Sort by: Recently Updated</option>
            </select>
          </div>

          {/* Skill Chart */}
          {!isLoading && skills.length > 0 && (
            <div className="bg-card rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Skill Distribution</h2>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/3 h-64 flex justify-center items-center mb-4 md:mb-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCategoryCounts()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getCategoryCounts().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-2/3 space-y-3">
                  {getCategoryCounts().map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="mr-2">{entry.name}</span>
                      <div className="flex-grow h-2 bg-secondary rounded-full">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(entry.value / skills.length) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                      <span className="ml-2">{((entry.value / skills.length) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="h-6 bg-accent/20 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-accent/20 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-accent/20 rounded w-40 mt-4"></div>
                  <div className="h-3 bg-accent/20 rounded w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onEdit={() => {}} // Will be implemented
                  onDelete={() => deleteSkillMutation.mutate(skill.id)}
                />
              ))}

              {/* Add Skill Card */}
              <div
                className="bg-secondary rounded-xl p-6 border-2 border-dashed border-accent/30 hover:border-accent/50 transition cursor-pointer flex flex-col items-center justify-center text-center h-[220px]"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-primary text-2xl mb-4">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">Add New Skill</h3>
                <p className="text-muted-foreground text-sm">Track and improve your abilities</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddSkillDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
