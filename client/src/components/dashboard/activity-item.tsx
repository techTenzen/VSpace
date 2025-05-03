import { CalendarCheck, ChartLine, GraduationCap, Lightbulb } from "lucide-react";
import { Activity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

type ActivityIconProps = {
  type: string;
};

function ActivityIcon({ type }: ActivityIconProps) {
  switch (type) {
    case "skill":
      return (
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary flex-shrink-0">
          <ChartLine className="h-5 w-5" />
        </div>
      );
    case "attendance":
      return (
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary flex-shrink-0">
          <CalendarCheck className="h-5 w-5" />
        </div>
      );
    case "gpa":
      return (
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary flex-shrink-0">
          <GraduationCap className="h-5 w-5" />
        </div>
      );
    case "idea":
      return (
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary flex-shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary flex-shrink-0">
          <ChartLine className="h-5 w-5" />
        </div>
      );
  }
}

export default function ActivityItem({ activity }: { activity: Activity }) {
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });
  
  let metadata: any = {};
  if (activity.metadata) {
    try {
      metadata = JSON.parse(activity.metadata);
    } catch (error) {
      console.error("Error parsing activity metadata:", error);
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <ActivityIcon type={activity.type} />
      <div>
        <h4 className="font-medium">{activity.description}</h4>
        {metadata && Object.keys(metadata).length > 0 && (
          <p className="text-muted-foreground text-sm">
            {activity.type === "attendance" && metadata.current && (
              <>Current attendance: {metadata.current}</>
            )}
            {activity.type === "gpa" && metadata.grade && (
              <>Grade: {metadata.grade}, Credits: {metadata.credits}</>
            )}
          </p>
        )}
        <p className="text-muted-foreground/50 text-xs mt-1">{timeAgo}</p>
      </div>
    </div>
  );
}
