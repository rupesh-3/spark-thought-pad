import { Trophy, Flame, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GamificationStatsProps {
  points: number;
  streak: number;
  level: number;
}

const GamificationStats = ({ points, streak, level }: GamificationStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in">
      <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-button">
            <Star className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Points</p>
            <p className="text-2xl font-bold text-foreground">{points}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-button">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="text-2xl font-bold text-foreground">{streak} days</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-button">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-2xl font-bold text-foreground">{level}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GamificationStats;
