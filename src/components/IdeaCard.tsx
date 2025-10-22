import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface IdeaCardProps {
  id: string;
  text: string;
  onDelete: (id: string) => void;
}

const IdeaCard = ({ id, text, onDelete }: IdeaCardProps) => {
  return (
    <Card className="group shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <CardContent className="p-6 flex items-start justify-between gap-4">
        <p className="text-foreground flex-1 leading-relaxed">{text}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          aria-label="Delete idea"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
