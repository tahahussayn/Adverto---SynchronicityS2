-- users see own campaigns
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    meta_ad_account_id TEXT,
    meta_tokens JSONB,
    plan TEXT DEFAULT 'free',
    usage_credits INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    objective TEXT,
    target_audience JSONB DEFAULT '{}'::jsonb,
    budget_thresholds JSONB DEFAULT '{"max_cpa": 15.00, "min_roas": 2.5, "min_ctr": 0.008, "min_spend_before_eval": 50.00}'::jsonb,
    meta_campaign_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE creatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'generating',
    format_type TEXT NOT NULL,
    headline TEXT,
    body_copy TEXT,
    cta_text TEXT,
    image_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    meta_ad_id TEXT,
    performance_score FLOAT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE ad_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_creative_id UUID REFERENCES creatives(id) ON DELETE CASCADE NOT NULL,
    variant_type TEXT,
    headline TEXT,
    body_copy TEXT,
    image_url TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
    creative_id UUID REFERENCES creatives(id) ON DELETE CASCADE NOT NULL,
    metric_date DATE NOT NULL,
    spend FLOAT DEFAULT 0.0,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    ctr FLOAT DEFAULT 0.0,
    cpa FLOAT DEFAULT 0.0,
    roas FLOAT DEFAULT 0.0,
    reach INT DEFAULT 0,
    frequency FLOAT DEFAULT 0.0,
    conversions INT DEFAULT 0,
    data_freshness TEXT DEFAULT 'estimated',
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(creative_id, metric_date)
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'running',
    retry_count INT DEFAULT 0,
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB,
    error TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX ON campaigns (user_id);
CREATE INDEX ON creatives (campaign_id, status);
CREATE INDEX ON performance_metrics (creative_id, metric_date DESC);
CREATE INDEX ON jobs (campaign_id, status, started_at DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users see own campaigns" ON campaigns FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users see own creatives" ON creatives FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

CREATE POLICY "Users see own ad_variants" ON ad_variants FOR ALL USING (
  parent_creative_id IN (
    SELECT id FROM creatives WHERE campaign_id IN (
      SELECT id FROM campaigns WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users see own performance_metrics" ON performance_metrics FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

CREATE POLICY "Users see own jobs" ON jobs FOR ALL USING (
  campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid())
);

-- Realtime Configuration
ALTER PUBLICATION supabase_realtime ADD TABLE creatives;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;

-- Storage Bucket for Ad Assets
INSERT INTO storage.buckets (id, name, public) VALUES ('ad-assets', 'ad-assets', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'ad-assets');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-assets' AND auth.role() = 'authenticated');
