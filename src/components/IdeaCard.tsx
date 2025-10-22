import { useState } from "react";
import { Trash2, Edit2, Check, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface IdeaCardProps {
  id: string;
  text: string;
  category?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const IdeaCard = ({ id, text, category, onDelete, onEdit }: IdeaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(id, editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(text);
    setIsEditing(false);
  };

  return (
    <Card className="group shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.01] animate-fade-in border-l-4 border-l-primary/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {isEditing ? (
            <div className="flex-1 flex gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1"
                autoFocus
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") handleCancel();
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="text-primary hover:bg-primary/10 shrink-0"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-muted-foreground hover:bg-muted shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <p className="text-foreground leading-relaxed mb-2">{text}</p>
                {category && (
                  <Badge variant="secondary" className="mt-2">
                    <Tag className="h-3 w-3 mr-1" />
                    {category}
                  </Badge>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label="Edit idea"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete idea"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
