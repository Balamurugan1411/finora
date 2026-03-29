-- Create a table for user financial data
CREATE TABLE public.financial_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_income NUMERIC NOT NULL DEFAULT 0,
  monthly_expenses NUMERIC NOT NULL DEFAULT 0,
  current_savings NUMERIC NOT NULL DEFAULT 0,
  financial_goals TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.financial_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own financial data"
  ON public.financial_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial data"
  ON public.financial_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial data"
  ON public.financial_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial data"
  ON public.financial_data FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_financial_data_updated_at
  BEFORE UPDATE ON public.financial_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();