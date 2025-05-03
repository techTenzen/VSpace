import { Skill } from "@shared/schema";
import { Star, StarHalf, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: number) => void;
}

export default function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const renderStars = (proficiency: number) => {
    const stars = [];
    const fullStars = Math.floor(proficiency);
    const hasHalfStar = proficiency % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-current" />);
    }
    
    const emptyStars = 5 - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-muted-foreground/30" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-card rounded-xl p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-medium">{skill.name}</h3>
          <p className="text-muted-foreground text-sm mb-2">{skill.category}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground transition"
            onClick={() => onEdit(skill)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit skill</span>
          </Button>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete skill</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the skill "{skill.name}" and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(skill.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="text-primary text-lg flex">
          {renderStars(skill.proficiency)}
        </div>
        <span className="ml-2 text-muted-foreground">{skill.proficiency}/5</span>
      </div>
      {skill.notes && <p className="mt-4 text-sm">{skill.notes}</p>}
    </div>
  );
}
