import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import IdeaCard from "@/components/idea-wall/idea-card";
import ShareIdeaDialog from "@/components/idea-wall/share-idea-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Idea, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, SortAsc, SortDesc, RefreshCw } from "lucide-react";

type IdeaWithUser = Idea & { user: User };

export default function IdeaWallPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Fetch all ideas
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery<IdeaWithUser[]>({
    queryKey: ["/api/ideas"],
    queryFn: async () => {
      try {
        const result = await apiRequest("GET", "/api/ideas");
        console.log("API Response:", result);
        return Array.isArray(result) ? result : [];
      } catch (err) {
        console.error("Error fetching ideas:", err);
        throw err;
      }
    },
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const ideas: IdeaWithUser[] = data ?? [];

  useEffect(() => {
    console.log("Ideas data:", ideas);
  }, [ideas]);

  const deleteIdeaMutation = useMutation({
    mutationFn: async (ideaId: number) => {
      await apiRequest("DELETE", `/api/ideas/${ideaId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ideas"] });
      toast({
        title: "Idea deleted",
        description: "Your idea has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete idea",
        description: error.message || "An error occurred while deleting the idea.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteIdea = (ideaId: number) => {
    deleteIdeaMutation.mutate(ideaId);
  };

  const filteredIdeas = ideas.filter((idea) => {
    return (
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (idea.user?.fullName && idea.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Force refetch when dialog closes
  useEffect(() => {
    if (!isShareDialogOpen) {
      refetch();
    }
  }, [isShareDialogOpen, refetch]);

  return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <SidebarNav />
        <div className="flex-1">
          <MobileNav />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold">Idea Wall</h1>
              <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    title="Refresh ideas"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => setIsShareDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" /> Share Idea
                </Button>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search ideas or authors..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              >
                {sortOrder === "newest" ? (
                    <>
                      <SortDesc className="h-4 w-4" /> Newest First
                    </>
                ) : (
                    <>
                      <SortAsc className="h-4 w-4" /> Oldest First
                    </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} available
                {user && ` • ${ideas.filter(idea => idea.userId === user.id).length} of your own`}
              </p>
            </div>

            {/* Ideas Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-accent/20 mr-3"></div>
                              <div>
                                <div className="h-4 w-24 bg-accent/20 rounded"></div>
                                <div className="h-3 w-16 bg-accent/10 rounded mt-1"></div>
                              </div>
                            </div>
                          </div>
                          <div className="h-6 w-3/4 bg-accent/20 rounded mb-2"></div>
                          <div className="h-4 w-full bg-accent/10 rounded mb-2"></div>
                          <div className="h-4 w-5/6 bg-accent/10 rounded mb-2"></div>
                          <div className="h-4 w-4/6 bg-accent/10 rounded mb-4"></div>
                          <div className="flex justify-between items-center">
                            <div className="h-3 w-16 bg-accent/10 rounded"></div>
                            <div className="h-8 w-16 bg-accent/20 rounded"></div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
            ) : error ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <h2 className="text-xl font-semibold mb-2">Error Loading Ideas</h2>
                    <p className="text-muted-foreground text-center mb-6">
                      There was an error loading ideas. Please try again later.
                    </p>
                    <Button onClick={() => refetch()}>Try Again</Button>
                  </CardContent>
                </Card>
            ) : sortedIdeas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedIdeas.map((idea) => (
                      <IdeaCard
                          key={idea.id}
                          idea={idea}
                          onDelete={user?.id === idea.userId ? handleDeleteIdea : undefined}
                      />
                  ))}
                </div>
            ) : searchTerm ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <h2 className="text-xl font-semibold mb-2">No Ideas Found</h2>
                    <p className="text-muted-foreground text-center mb-6">
                      No ideas match your search term. Try a different search or clear the filter.
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
            ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <h2 className="text-xl font-semibold mb-2">No Ideas Yet</h2>
                    <p className="text-muted-foreground text-center mb-6">
                      Be the first to share an innovative idea with the VIT-AP community!
                    </p>
                    <Button onClick={() => setIsShareDialogOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Share Your First Idea
                    </Button>
                  </CardContent>
                </Card>
            )}
          </main>
        </div>
        <ShareIdeaDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} />
      </div>
  );
}