import { Link } from "wouter";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  value?: string;
  text?: string;
  percentage?: number;
  link: string;
  valueClassName?: string;
  progressClassName?: string;
};

export default function FeatureCard({
  title,
  subtitle,
  icon,
  value,
  text,
  percentage,
  link,
  valueClassName,
  progressClassName,
}: FeatureCardProps) {
  return (
    <Link href={link}>
      <a className="bg-card rounded-xl p-6 hover:shadow-lg transition cursor-pointer hover:bg-card/80 block">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{subtitle}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <div className="mt-2">
          {percentage !== undefined && (
            <>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {text ? text : ""}
                </span>
                <span className={valueClassName}>{value}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className={cn("rounded-full h-2", progressClassName || "bg-primary")} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </>
          )}
          {text && !percentage && (
            <div className="text-sm truncate">{text}</div>
          )}
        </div>
      </a>
    </Link>
  );
}
