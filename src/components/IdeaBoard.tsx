import { useState, useEffect, FormEvent } from "react";
import { Plus, Lightbulb, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IdeaCard from "./IdeaCard";
import GamificationStats from "./GamificationStats";
import ThemeToggle from "./ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Session } from "@supabase/supabase-js";

interface Idea {
  id: string;
  text: string;
  timestamp: number;
  category?: string;
}

interface GamificationData {
  points: number;
  streak: number;
  lastIdeaDate: string | null;
}

const IdeaBoard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [gamification, setGamification] = useState<GamificationData>({
    points: 0,
    streak: 0,
    lastIdeaDate: null,
  });

  const categories = ["Work", "Personal", "Creative", "Learning"];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#16a34a", "#15803d"],
    });
  };

  // Auth and data loading
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const storedIdeas = localStorage.getItem("ideas");
    if (storedIdeas) {
      try {
        setIdeas(JSON.parse(storedIdeas));
      } catch (error) {
        console.error("Failed to parse stored ideas:", error);
      }
    }

    const storedGamification = localStorage.getItem("gamification");
    if (storedGamification) {
      try {
        setGamification(JSON.parse(storedGamification));
      } catch (error) {
        console.error("Failed to parse stored gamification:", error);
      }
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  // Save gamification data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gamification", JSON.stringify(gamification));
  }, [gamification]);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastDate = gamification.lastIdeaDate;

    if (!lastDate) {
      return { streak: 1, lastIdeaDate: today };
    }

    const lastDateObj = new Date(lastDate);
    const todayObj = new Date(today);
    const diffTime = todayObj.getTime() - lastDateObj.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 0) {
      return { streak: gamification.streak, lastIdeaDate: today };
    } else if (diffDays === 1) {
      return { streak: gamification.streak + 1, lastIdeaDate: today };
    } else {
      return { streak: 1, lastIdeaDate: today };
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      toast({
        title: "Empty idea",
        description: "Please enter some text before adding an idea.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedValue.length > 500) {
      toast({
        title: "Idea too long",
        description: "Please keep your idea under 500 characters.",
        variant: "destructive",
      });
      return;
    }

    const newIdea: Idea = {
      id: Date.now().toString(),
      text: trimmedValue,
      timestamp: Date.now(),
      category: selectedCategory !== "all" ? selectedCategory : undefined,
    };

    setIdeas([newIdea, ...ideas]);
    setInputValue("");

    // Update gamification
    const streakData = updateStreak();
    const newPoints = gamification.points + 10;
    const newLevel = calculateLevel(newPoints);
    const oldLevel = calculateLevel(gamification.points);

    setGamification({
      points: newPoints,
      streak: streakData.streak,
      lastIdeaDate: streakData.lastIdeaDate,
    });

    let toastMessage = "Your brilliant thought has been saved. +10 points!";
    if (newLevel > oldLevel) {
      toastMessage = `Level up! You're now level ${newLevel}! 🎉`;
      triggerConfetti();
    } else if (streakData.streak > gamification.streak) {
      toastMessage = `${streakData.streak} day streak! Keep it going! 🔥`;
    }
    
    toast({
      title: "Idea added! 💡",
      description: toastMessage,
    });
  };

  const handleDelete = (id: string) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
    toast({
      title: "Idea removed",
      description: "The idea has been deleted.",
    });
  };

  const handleEdit = (id: string, newText: string) => {
    setIdeas(ideas.map((idea) => 
      idea.id === id ? { ...idea, text: newText } : idea
    ));
    toast({
      title: "Idea updated",
      description: "Your idea has been successfully updated.",
    });
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = idea.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Controls */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-6 shadow-button">
            <Lightbulb className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Idea Board
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capture your creative sparks and watch your brilliance grow. Every great project starts with a simple idea.
          </p>
        </div>

        {/* Gamification Stats */}
        <GamificationStats
          points={gamification.points}
          streak={gamification.streak}
          level={calculateLevel(gamification.points)}
        />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8 animate-scale-in">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What's your next brilliant idea?"
                className="flex-1 h-14 px-6 text-base shadow-card border-input focus-visible:ring-primary"
                maxLength={500}
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-gradient-primary hover:opacity-90 shadow-button transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Idea
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="transition-all duration-200"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </form>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your ideas..."
              className="pl-12 h-12 shadow-card"
            />
          </div>
        </div>

        {/* Ideas List */}
        {filteredIdeas.length === 0 && ideas.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-6">
              <Lightbulb className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No ideas yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start adding your creative thoughts and build your collection of genius ideas!
            </p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              No ideas found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or category filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Your Ideas
              </h2>
              <span className="text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-full">
                {filteredIdeas.length} {filteredIdeas.length === 1 ? "idea" : "ideas"}
              </span>
            </div>
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                id={idea.id}
                text={idea.text}
                category={idea.category}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaBoard;
