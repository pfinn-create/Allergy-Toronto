-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Places table
CREATE TABLE places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  website TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  approved BOOLEAN DEFAULT false
);

-- Place allergies (what each place accommodates)
CREATE TABLE place_allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  allergy_type TEXT NOT NULL,
  UNIQUE(place_id, allergy_type)
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 1 AND 5),
  staff_knowledge_score INTEGER NOT NULL CHECK (staff_knowledge_score BETWEEN 1 AND 5),
  menu_options_score INTEGER NOT NULL CHECK (menu_options_score BETWEEN 1 AND 5),
  cross_contamination_score INTEGER NOT NULL CHECK (cross_contamination_score BETWEEN 1 AND 5),
  review_text TEXT,
  allergies_mentioned TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(place_id, user_id)
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View: places with computed average ratings and allergy list
CREATE VIEW places_with_ratings AS
SELECT
  p.*,
  ROUND(AVG(r.overall_score)::numeric, 1) AS average_rating,
  COUNT(r.id) AS rating_count,
  ARRAY_AGG(DISTINCT pa.allergy_type) FILTER (WHERE pa.allergy_type IS NOT NULL) AS allergies
FROM places p
LEFT JOIN ratings r ON r.place_id = p.id
LEFT JOIN place_allergies pa ON pa.place_id = p.id
GROUP BY p.id;

-- RLS Policies
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Places: anyone can read approved places
CREATE POLICY "Public read approved places" ON places
  FOR SELECT USING (approved = true);

-- Places: authenticated users can insert
CREATE POLICY "Auth users can add places" ON places
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Places: creators can update their own pending places
CREATE POLICY "Creators can update own places" ON places
  FOR UPDATE USING (auth.uid() = created_by AND approved = false);

-- Place allergies: anyone can read
CREATE POLICY "Public read place allergies" ON place_allergies
  FOR SELECT USING (true);

-- Place allergies: auth users can insert for places they created
CREATE POLICY "Auth users can add allergies" ON place_allergies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Ratings: anyone can read
CREATE POLICY "Public read ratings" ON ratings
  FOR SELECT USING (true);

-- Ratings: auth users can insert their own ratings
CREATE POLICY "Auth users can rate" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ratings: users can update their own ratings
CREATE POLICY "Users can update own ratings" ON ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Ratings: users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON ratings
  FOR DELETE USING (auth.uid() = user_id);

-- Profiles: users can read all profiles
CREATE POLICY "Public read profiles" ON profiles
  FOR SELECT USING (true);

-- Profiles: users can update own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: users can insert own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Seed some approved Toronto places for demo
INSERT INTO places (name, address, neighborhood, cuisine_type, description, approved) VALUES
  ('The Green Sprout', '340 Queen St W, Toronto', 'Queen West', 'Vegetarian/Vegan', 'Dedicated vegetarian restaurant with extensive allergy menu and knowledgeable staff.', true),
  ('Kupfert & Kim', '100 King St W, Toronto', 'Downtown', 'Vegan Bowl', 'Fast casual vegan bowls. Everything is clearly labeled. Staff trained on all allergies.', true),
  ('Planta', '1221 Bay St, Toronto', 'Yorkville', 'Plant-based', 'Upscale plant-based dining. Completely nut-free kitchen available on request.', true),
  ('Farmhouse Tavern', '1627 Dupont St, Toronto', 'West End', 'Modern Canadian', 'Farm-to-table with detailed allergy guides for every dish. Chef speaks to allergy guests.', true),
  ('Fresh on Bloor', '521 Bloor St W, Toronto', 'The Annex', 'Vegetarian', 'Long-standing vegetarian restaurant with gluten-free and vegan options clearly marked.', true);

-- Seed allergies for the demo places
INSERT INTO place_allergies (place_id, allergy_type)
SELECT p.id, a.allergy FROM places p
CROSS JOIN (VALUES ('gluten'), ('dairy'), ('nuts'), ('eggs'), ('soy')) AS a(allergy)
WHERE p.name = 'The Green Sprout';

INSERT INTO place_allergies (place_id, allergy_type)
SELECT p.id, a.allergy FROM places p
CROSS JOIN (VALUES ('gluten'), ('dairy'), ('nuts'), ('eggs'), ('soy'), ('shellfish'), ('vegan')) AS a(allergy)
WHERE p.name = 'Kupfert & Kim';

INSERT INTO place_allergies (place_id, allergy_type)
SELECT p.id, a.allergy FROM places p
CROSS JOIN (VALUES ('gluten'), ('dairy'), ('nuts'), ('eggs'), ('shellfish'), ('fish'), ('vegan')) AS a(allergy)
WHERE p.name = 'Planta';

INSERT INTO place_allergies (place_id, allergy_type)
SELECT p.id, a.allergy FROM places p
CROSS JOIN (VALUES ('gluten'), ('dairy'), ('nuts'), ('eggs'), ('shellfish')) AS a(allergy)
WHERE p.name = 'Farmhouse Tavern';

INSERT INTO place_allergies (place_id, allergy_type)
SELECT p.id, a.allergy FROM places p
CROSS JOIN (VALUES ('gluten'), ('dairy'), ('nuts'), ('vegetarian'), ('vegan')) AS a(allergy)
WHERE p.name = 'Fresh on Bloor';
