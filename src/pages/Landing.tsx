import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Sparkles, Trophy, Target } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Idea Board</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Capture Your Creative Sparks</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Turn Ideas Into
            <span className="text-primary block mt-2">Reality</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            A minimalist brainstorming tool with gamification to capture, organize, and track your creative ideas.
          </p>
          
          <Button 
            size="lg" 
            className="animate-scale-in shadow-button hover:shadow-button-hover"
            onClick={() => navigate("/auth")}
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Capture Ideas</h3>
            <p className="text-muted-foreground">
              Quickly jot down your creative sparks and organize them by category.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Earn Rewards</h3>
            <p className="text-muted-foreground">
              Level up and maintain streaks as you consistently capture your ideas.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Stay Organized</h3>
            <p className="text-muted-foreground">
              Filter and search through your ideas to find exactly what you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
