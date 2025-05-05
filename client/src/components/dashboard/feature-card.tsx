import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle, AlertTriangle, TrendingUp, ChevronRight } from "lucide-react";

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
  status?: "success" | "warning" | "neutral" | "error";
  importance?: "low" | "medium" | "high";
  lastUpdated?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
};

export default function FeatureCard({
                                      title,
                                      subtitle,
                                      icon,
                                      value,
                                      text,
                                      percentage = 0,
                                      link,
                                      valueClassName,
                                      progressClassName,
                                      status = "neutral",
                                      importance = "medium",
                                      lastUpdated,
                                      trend,
                                      trendValue,
                                    }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Set progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Status colors
  const statusConfig = {
    success: {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      bgLight: "bg-emerald-100",
      icon: <CheckCircle size={16} className="text-emerald-500" />
    },
    warning: {
      bg: "bg-amber-500",
      text: "text-amber-500",
      bgLight: "bg-amber-100",
      icon: <AlertTriangle size={16} className="text-amber-500" />
    },
    error: {
      bg: "bg-red-500",
      text: "text-red-500",
      bgLight: "bg-red-100",
      icon: <AlertTriangle size={16} className="text-red-500" />
    },
    neutral: {
      bg: "bg-primary",
      text: "text-primary",
      bgLight: "bg-primary/10",
      icon: null
    }
  };

  // Importance styles
  const importanceStyles = {
    low: "border-l-0",
    medium: "border-l-4 border-l-primary/30",
    high: "border-l-4 border-l-primary"
  };

  // Trend indicator
  const renderTrend = () => {
    if (!trend) return null;

    const trendStyles = {
      up: "text-emerald-500",
      down: "text-red-500",
      stable: "text-blue-500"
    };

    return (
        <div className={`flex items-center gap-1 ${trendStyles[trend]} text-xs font-medium`}>
          {trend === "up" && <TrendingUp size={14} />}
          {trend === "down" && <TrendingUp size={14} className="rotate-180" />}
          {trend === "stable" && <span className="block w-3 h-0.5 bg-current rounded-full" />}
          {trendValue}
        </div>
    );
  };

  return (
      <Link to={link}>
        <div
            className={cn(
                "relative overflow-hidden rounded-xl bg-card transition-all duration-300",
                "hover:shadow-xl cursor-pointer group",
                importanceStyles[importance]
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
          {/* Premium highlight corner */}
          {importance === "high" && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute transform rotate-45 bg-primary text-primary-foreground text-xs font-bold py-1 right-[-32px] top-[12px] w-[120px] flex justify-center">
                  PRIORITY
                </div>
              </div>
          )}

          <div className="flex flex-col h-full">
            {/* Header section */}
            <div className="p-5 pb-2 flex items-start justify-between">
              <div
                  className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                      statusConfig[status].bgLight
                  )}
              >
                <div className="text-primary-foreground">
                  {icon}
                </div>
              </div>

              <div className="flex flex-col items-end">
                {status !== "neutral" && (
                    <div className="flex items-center gap-1.5 mb-1 bg-secondary/30 px-2 py-0.5 rounded-full">
                      {statusConfig[status].icon}
                      <span className={`text-xs font-medium ${statusConfig[status].text}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                    </div>
                )}
                {lastUpdated && (
                    <span className="text-xs text-muted-foreground mt-1">
                  Updated {lastUpdated}
                </span>
                )}
              </div>
            </div>

            {/* Content section */}
            <div className="px-5 pb-5 flex-grow">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  {title}
                </h3>
                {renderTrend()}
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {subtitle}
              </p>

              {/* Progress section with better visuals */}
              {percentage !== undefined && (
                  <div className="mt-4 mb-2">
                    <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground/80">
                    {text ? text : "Progress"}
                  </span>
                      <span className={cn(
                          "font-semibold",
                          percentage > 66 ? "text-emerald-500" :
                              percentage > 33 ? "text-amber-500" :
                                  "text-red-500",
                          valueClassName
                      )}>
                    {value || `${percentage}%`}
                  </span>
                    </div>

                    <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                          className={cn(
                              "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out",
                              percentage > 66 ? "bg-emerald-500" :
                                  percentage > 33 ? "bg-amber-500" :
                                      "bg-red-500",
                              progressClassName
                          )}
                          style={{ width: `${progressWidth}%` }}
                      />

                      {/* Progress markers */}
                      <div className="absolute top-0 left-0 w-full h-full flex justify-between px-[1px]">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-full w-0.5 bg-background opacity-50"
                                )}
                            />
                        ))}
                      </div>
                    </div>
                  </div>
              )}

              {/* Text only variant with improved styling */}
              {text && !percentage && (
                  <div className="mt-4 text-sm text-foreground/90 bg-secondary/30 p-3 rounded-lg">
                    {text}
                  </div>
              )}
            </div>

            {/* Footer section with call to action */}
            <div
                className={cn(
                    "px-5 py-3 border-t border-border flex items-center justify-between transition-all",
                    isHovered ? "bg-primary/5" : "bg-transparent"
                )}
            >
            <span className="text-xs font-medium text-primary">
              View details
            </span>
              <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  "bg-primary/10 text-primary transition-all duration-300",
                  isHovered ? "translate-x-1" : ""
              )}>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>

          {/* Interactive hover effect */}
          <div
              className={cn(
                  "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300",
                  isHovered ? "opacity-100" : ""
              )}
          />
        </div>
      </Link>
  );
}