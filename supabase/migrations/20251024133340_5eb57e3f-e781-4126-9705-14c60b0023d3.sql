-- Add DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Create ideas table with proper RLS
CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  category text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ideas"
ON public.ideas
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own ideas"
ON public.ideas
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ideas"
ON public.ideas
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own ideas"
ON public.ideas
FOR DELETE
USING (user_id = auth.uid());

-- Create gamification table with proper RLS
CREATE TABLE public.gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  last_idea_date text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own gamification data"
ON public.gamification
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own gamification data"
ON public.gamification
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own gamification data"
ON public.gamification
FOR UPDATE
USING (user_id = auth.uid());

-- Add trigger for ideas updated_at
CREATE TRIGGER update_ideas_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for gamification updated_at
CREATE TRIGGER update_gamification_updated_at
BEFORE UPDATE ON public.gamification
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();