-- liver_search_history テーブルの作成
CREATE TABLE IF NOT EXISTS liver_search_history (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  modifier_id UUID NOT NULL REFERENCES auth.users(id),
  search_word TEXT NOT NULL,
  result_count INTEGER NOT NULL
);

-- RLSポリシーの設定（Row Level Security）
ALTER TABLE liver_search_history ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の履歴のみ閲覧可能
CREATE POLICY "Users can view own search history" 
  ON liver_search_history 
  FOR SELECT 
  USING (auth.uid() = creator_id);

-- ユーザーは自分の履歴のみ作成可能
CREATE POLICY "Users can insert own search history" 
  ON liver_search_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = creator_id);