-- ==========================================
-- SEED DATA FOR NPLUSONE (PRODUCTS)
-- Generated from additionalProducts.ts
-- ==========================================

-- 1. CLEANUP (Optional: Clear existing products)
-- TRUNCATE TABLE public.products CASCADE;

-- 1.1 SCHEMA FIX (Auto-add missing column if needed)
DO $$
BEGIN
    -- Check for alt_text
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='alt_text') THEN
        ALTER TABLE public.products ADD COLUMN alt_text TEXT;
    END IF;

    -- Check for is_admin_uploaded
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_admin_uploaded') THEN
        ALTER TABLE public.products ADD COLUMN is_admin_uploaded BOOLEAN DEFAULT false;
    END IF;
END $$;


-- 2. INSERT PRODUCTS
INSERT INTO public.products (
  title, brand_name, style_code, short_description, description,
  mrp, selling_price,
  category, subcategory,
  image_url, image_urls,
  stock_quantity,
  sku_map, default_sku,
  color_options, main_color, sizes,
  fabric, work_type, neck_design, sleeve_length, fit_type, bottom_type, set_contains, product_weight, wash_care,
  search_keywords, slug, alt_text,
  hsn_code, gst_percentage,
  status, is_admin_uploaded
) VALUES
-- Product 1: Regal Violet Rayon Suit
(
  'Regal Violet Rayon Suit with Contrast Cream Dupatta', 'Nplusone Fashion', 'D3P-1', NULL,
  'Make a graceful entrance in this deep Violet Rayon Slub suit. The kurta features an intricately embroidered neckline in silver tones. It is elegantly paired with a contrasting Cream Chanderi Dupatta with a gold border, offering a royal look perfect for evening functions.',
  1299, 571,
  'SUIT SET', NULL,
  '/products/D3P_1/s4lcch4fz3whzyycf2sv.webp',
  ARRAY['/products/D3P_1/s4lcch4fz3whzyycf2sv.webp', '/products/D3P_1/pux6upikyvwofidhbygy.webp', '/products/D3P_1/onfvogfywtagd8vrlt4i.webp', '/products/D3P_1/jlxlgdbrfchr85pbglqc.webp', '/products/D3P_1/c8syf6qcij0zj3swdn3t.webp'],
  100,
  '{"S": "DEP-1-S", "M": "DEP-1-M", "L": "DEP-1-L", "XL": "DEP-1-XL", "XXL": "DEP-1-XXL"}'::jsonb, 'D3P-1',
  '[{"name": "Maroon", "code": "#800000"}]'::jsonb, 'Maroon', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'regal-violet-rayon-suit-d3p-1', 'Regal Violet Rayon Suit with Contrast Cream Dupatta',
  'D3P-1', 5,
  'active', true
),
-- Product 2: Peacock Blue Rayon Suit
(
  'Peacock Blue Rayon Suit with White Floral Dupatta', 'Nplusone Fashion', 'D3P-2', NULL,
  'Stand out in this stunning Peacock Blue (Teal) Rayon Slub suit. The kurta features a defined embroidered yoke in silver. It is contrasted perfectly with a White Chanderi Dupatta featuring soft floral prints, creating a refreshing look for any occasion.',
  1299, 571,
  'SUIT SET', NULL,
  '/products/D3P_2/01_1.webp',
  ARRAY['/products/D3P_2/01_1.webp', '/products/D3P_2/02_1.webp', '/products/D3P_2/04_1.webp', '/products/D3P_2/05_1.webp', '/products/D3P_2/06_1.webp'],
  100,
  '{"S": "DEP-2-S", "M": "DEP-2-M", "L": "DEP-2-L", "XL": "DEP-2-XL", "XXL": "DEP-2-XXL"}'::jsonb, 'D3P-2',
  '[{"name": "Royal Blue", "code": "#4169E1"}]'::jsonb, 'Royal Blue', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'peacock-blue-rayon-suit-d3p-2', 'Peacock Blue Rayon Suit with White Floral Dupatta',
  'D3P-2', 5,
  'active', true
),
-- Product 3: Chic Off-White Kurti Set
(
  'Chic Off-White Kurti Set with Geometric Red Embroidery', 'Nplusone Fashion', 'D3P-3', NULL,
  'A perfect blend of modern and traditional, this Off-White 3-piece set features striking geometric red embroidery on the yoke and sleeves. The look is vibrant with a bright Pink/Red Chanderi Dupatta, making it an ideal choice for office wear or day gatherings.',
  1299, 601,
  'SUIT SET', NULL,
  '/products/D3P_3/5.webp',
  ARRAY['/products/D3P_3/5.webp', '/products/D3P_3/2.webp', '/products/D3P_3/4.webp', '/products/D3P_3/3.webp', '/products/D3P_3/6.webp'],
  100,
  '{"S": "DEP-3-S", "M": "DEP-3-M", "L": "DEP-3-L", "XL": "DEP-3-XL", "XXL": "DEP-3-XXL"}'::jsonb, 'D3P-3',
  '[{"name": "Off White", "code": "#F5F5F5"}]'::jsonb, 'Off White', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'chic-off-white-kurti-set-d3p-3', 'Chic Off-White Kurti Set with Geometric Red Embroidery',
  'D3P-3', 5,
  'active', true
),
-- Product 4: Ruby Pink Rayon Kurti Set
(
  'Ruby Pink Rayon Kurti Set with V-Neck Embroidery', 'Nplusone Fashion', 'D3P-4', NULL,
  'Add a pop of color with this Ruby Pink (Magenta) Rayon Slub set. The V-neckline is highlighted with colorful thread work. Paired with a matching pink Chanderi Dupatta featuring abstract floral prints, this outfit is both trendy and traditional.',
  1299, 571,
  'SUIT SET', NULL,
  '/products/D3P_4/01.webp',
  ARRAY['/products/D3P_4/01.webp', '/products/D3P_4/02.webp', '/products/D3P_4/04.webp', '/products/D3P_4/05.webp', '/products/D3P_4/06.webp'],
  100,
  '{"S": "DEP-4-S", "M": "DEP-4-M", "L": "DEP-4-L", "XL": "DEP-4-XL", "XXL": "DEP-4-XXL"}'::jsonb, 'D3P-4',
  '[{"name": "Red", "code": "#FF0000"}]'::jsonb, 'Red', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'V Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'ruby-pink-rayon-kurti-set-d3p-4', 'Ruby Pink Rayon Kurti Set with V-Neck Embroidery',
  'D3P-4', 5,
  'active', true
),
-- Product 5: Deep Eggplant Purple Suit
(
  'Deep Eggplant Purple Suit with Traditional Zari Work', 'Nplusone Fashion', 'D3P-5', NULL,
  'This Deep Eggplant Purple ensemble is designed for those who love understated luxury. The yoke features heavy traditional embroidery in muted antique gold/silver. Paired with a matching sheer Chanderi Dupatta, this set is comfortable yet festive ready.',
  1299, 561,
  'SUIT SET', NULL,
  '/products/D3P_5/01_2.webp',
  ARRAY['/products/D3P_5/01_2.webp', '/products/D3P_5/02_2.webp', '/products/D3P_5/04_2.webp', '/products/D3P_5/05_2.webp', '/products/D3P_5/06_2.webp'],
  100,
  '{"S": "DEP-5-S", "M": "DEP-5-M", "L": "DEP-5-L", "XL": "DEP-5-XL", "XXL": "DEP-5-XXL"}'::jsonb, 'D3P-5',
  '[{"name": "Purple", "code": "#800080"}]'::jsonb, 'Purple', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'deep-eggplant-purple-suit-d3p-5', 'Deep Eggplant Purple Suit with Traditional Zari Work',
  'D3P-5', 5,
  'active', true
),
-- Product 6: Sunshine Yellow Rayon Set
(
  'Sunshine Yellow Rayon Set with Large Floral Print Dupatta', 'Nplusone Fashion', 'D3P-6', NULL,
  'Bring the sunshine to your wardrobe with this bright Yellow 3-piece suit. The kurta features artistic embroidery, while the sheer Yellow Chanderi Dupatta steals the spotlight with large, hand-painted style pink floral motifs.',
  1299, 571,
  'SUIT SET', NULL,
  '/products/D3P_6/01_3.webp',
  ARRAY['/products/D3P_6/01_3.webp', '/products/D3P_6/02_3.webp', '/products/D3P_6/03.webp', '/products/D3P_6/04_3.webp', '/products/D3P_6/05_3.webp'],
  100,
  '{"S": "DEP-6-S", "M": "DEP-6-M", "L": "DEP-6-L", "XL": "DEP-6-XL", "XXL": "DEP-6-XXL"}'::jsonb, 'D3P-6',
  '[{"name": "Yellow", "code": "#FFFF00"}]'::jsonb, 'Yellow', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'V Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'sunshine-yellow-rayon-set-d3p-6', 'Sunshine Yellow Rayon Set with Large Floral Print Dupatta',
  'D3P-6', 5,
  'active', true
),
-- Product 7: Cream & Lime Green Rayon Suit
(
  'Cream & Lime Green Rayon Suit with Geometric Patterns', 'Nplusone Fashion', 'D3P-7', NULL,
  'Fresh and breezy, this Cream Rayon suit features distinct Lime Green geometric embroidery on the neck. It is paired with a solid Lime Green Chanderi Dupatta and matching pants, offering a minimalist yet stylish look for casual wear.',
  1299, 601,
  'SUIT SET', NULL,
  '/products/D3P_7/1.webp',
  ARRAY['/products/D3P_7/1.webp', '/products/D3P_7/2_1.webp', '/products/D3P_7/3_1.webp', '/products/D3P_7/4_1.webp', '/products/D3P_7/5_1.webp'],
  100,
  '{"S": "DEP-7-S", "M": "DEP-7-M", "L": "DEP-7-L", "XL": "DEP-7-XL", "XXL": "DEP-7-XXL"}'::jsonb, 'D3P-7',
  '[{"name": "Off White", "code": "#F5F5F5"}]'::jsonb, 'Off White', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Sequence Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'cream-lime-green-rayon-suit-d3p-7', 'Cream & Lime Green Rayon Suit with Geometric Patterns',
  'D3P-7', 5,
  'active', true
),
-- Product 8: Radiant Purple Kurti Set
(
  'Radiant Purple Kurti Set with Cascading Floral Dupatta', 'Nplusone Fashion', 'D3P-8', NULL,
  'Shine bright in this Radiant Purple 3-piece set. The kurta has a beautifully embroidered neckline with silver detailing. It comes with a matching Chanderi Dupatta that showcases artistic cascading floral prints, adding a feminine touch to the solid color base.',
  1299, 551,
  'SUIT SET', NULL,
  '/products/D3P_8/01.webp',
  ARRAY['/products/D3P_8/01.webp', '/products/D3P_8/02.webp', '/products/D3P_8/03.webp', '/products/D3P_8/04.webp', '/products/D3P_8/05.webp'],
  100,
  '{"S": "DEP-8-S", "M": "DEP-8-M", "L": "DEP-8-L", "XL": "DEP-8-XL", "XXL": "DEP-8-XXL"}'::jsonb, 'D3P-8',
  '[{"name": "Lavender Purple", "code": "#967BB6"}]'::jsonb, 'Lavender Purple', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'radiant-purple-kurti-set-d3p-8', 'Radiant Purple Kurti Set with Cascading Floral Dupatta',
  'D3P-8', 5,
  'active', true
),
-- Product 9: Wine Red Rayon Slub Ensemble
(
  'Wine Red Rayon Slub Ensemble with Floral Digital Print', 'Nplusone Fashion', 'D3P-9', NULL,
  'Exude elegance in this rich Wine Red (Maroon) suit. The rayon kurta is adorned with vertical thread embroidery that adds sophistication. The matching Chanderi Dupatta features large, vintage-style floral bouquets, creating a cohesive and stunning monochromatic look.',
  1299, 551,
  'SUIT SET', NULL,
  '/products/D3P_9/01_1.webp',
  ARRAY['/products/D3P_9/01_1.webp', '/products/D3P_9/02.webp', '/products/D3P_9/03_1.webp', '/products/D3P_9/04_1.webp'],
  100,
  '{"S": "DEP-9-S", "M": "DEP-9-M", "L": "DEP-9-L", "XL": "DEP-9-XL", "XXL": "DEP-9-XXL"}'::jsonb, 'D3P-9',
  '[{"name": "Wine", "code": "#722F37"}]'::jsonb, 'Wine', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'wine-red-rayon-slub-ensemble-d3p-9', 'Wine Red Rayon Slub Ensemble with Floral Digital Print',
  'D3P-9', 5,
  'active', true
),
-- Product 10: Pastel Sky Blue Rayon Set
(
  'Pastel Sky Blue Rayon Set with Pink Floral Dupatta', 'Nplusone Fashion', 'D3P-10', NULL,
  'Embrace the softness of pastels with this Sky Blue Rayon suit. The neckline features delicate multi-colored floral embroidery. The highlight is the matching Blue Chanderi Dupatta adorned with vibrant pink rose digital prints, perfect for a summer day out.',
  1299, 611,
  'SUIT SET', NULL,
  '/products/D3P_10/02_1.webp',
  ARRAY['/products/D3P_10/02_1.webp', '/products/D3P_10/03_2.webp', '/products/D3P_10/04_2.webp', '/products/D3P_10/05_1.webp'],
  100,
  '{"S": "DEP-10-S", "M": "DEP-10-M", "L": "DEP-10-L", "XL": "DEP-10-XL", "XXL": "DEP-10-XXL"}'::jsonb, 'D3P-10',
  '[{"name": "Sky Blue", "code": "#87CEEB"}]'::jsonb, 'Sky Blue', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'pastel-sky-blue-rayon-set-d3p-10', 'Pastel Sky Blue Rayon Set with Pink Floral Dupatta',
  'D3P-10', 5,
  'active', true
),
-- Product 11: Elegant Lavender Rayon Set
(
  'Elegant Lavender Rayon Set with Scalloped Hem', 'Nplusone Fashion', 'D3P-11', NULL,
  'Grace any occasion with this lovely Lavender Purple suit. The Rayon Slub kurta features intricate thread embroidery on the yoke and a stylish scalloped hemline with lace details. It is paired with a white Chanderi Dupatta adorned with large, artistic purple floral prints, creating a soft and feminine look.',
  1299, 651,
  'SUIT SET', NULL,
  '/products/D3P_11/01_2.webp',
  ARRAY['/products/D3P_11/01_2.webp', '/products/D3P_11/02_2.webp', '/products/D3P_11/03_3.webp', '/products/D3P_11/05_2.webp', '/products/D3P_11/06_1.webp'],
  100,
  '{"S": "DEP-11-S", "M": "DEP-11-M", "L": "DEP-11-L", "XL": "DEP-11-XL", "XXL": "DEP-11-XXL"}'::jsonb, 'D3P-11',
  '[{"name": "Light Purple", "code": "#E0B0FF"}]'::jsonb, 'Light Purple', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'elegant-lavender-rayon-set-d3p-11', 'Elegant Lavender Rayon Set with Scalloped Hem',
  'D3P-11', 5,
  'active', true
),
-- Product 12: Cream & Fuchsia Festive Set
(
  'Cream & Fuchsia Festive Set with Gold Print Dupatta', 'Nplusone Fashion', 'D3P-12', NULL,
  'Radiate festive vibes in this Cream Rayon Slub suit. The neckline features unique chain-link embroidery, and the sleeves are accented with floral motifs. The outfit pops with a bright Fuchsia Pink Chanderi Dupatta featuring rich gold traditional prints, perfect for celebrations.',
  1299, 601,
  'SUIT SET', NULL,
  '/products/D3P_12/1.webp',
  ARRAY['/products/D3P_12/1.webp', '/products/D3P_12/2.webp', '/products/D3P_12/3.webp', '/products/D3P_12/4.webp'],
  100,
  '{"S": "DEP-12-S", "M": "DEP-12-M", "L": "DEP-12-L", "XL": "DEP-12-XL", "XXL": "DEP-12-XXL"}'::jsonb, 'D3P-12',
  '[{"name": "White", "code": "#FFFFFF"}]'::jsonb, 'White', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Jacquard Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'cream-fuchsia-festive-set-d3p-12', 'Cream & Fuchsia Festive Set with Gold Print Dupatta',
  'D3P-12', 5,
  'active', true
),
-- Product 13: Petrol Blue Rayon Suit
(
  'Petrol Blue Rayon Suit with Silver Zari Border Dupatta', 'Nplusone Fashion', 'D3P-13', NULL,
  'Simplicity meets elegance in this Petrol Blue 3-piece ensemble. The kurta highlights a V-neckline with delicate silver and blue floral embroidery. Unlike others, this set features a matching solid blue Dupatta defined by a rich silver Zari border, making it perfect for formal office wear or evening dinners.',
  1299, 551,
  'SUIT SET', NULL,
  '/products/D3P_13/1_3.webp',
  ARRAY['/products/D3P_13/1_3.webp', '/products/D3P_13/2_3.webp', '/products/D3P_13/3_3.webp', '/products/D3P_13/5.webp'],
  100,
  '{"S": "DEP-13-S", "M": "DEP-13-M", "L": "DEP-13-L", "XL": "DEP-13-XL", "XXL": "DEP-13-XXL"}'::jsonb, 'D3P-13',
  '[{"name": "Navy Blue", "code": "#000080"}]'::jsonb, 'Navy Blue', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Jacquard Border Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'petrol-blue-rayon-suit-d3p-13', 'Petrol Blue Rayon Suit with Silver Zari Border Dupatta',
  'D3P-13', 5,
  'active', true
),
-- Product 14: Timeless Black Rayon Suit
(
  'Timeless Black Rayon Suit with Geometric Border Dupatta', 'Nplusone Fashion', 'D3P-14', NULL,
  'You can never go wrong with black. This Classic Black Kurti set features a sleek silver embroidered neckline. The white Chanderi Dupatta is the highlight, showcasing soft floral prints that transition into a striking geometric border at the palla. Matching black pants with silver hem stripes complete the look.',
  1299, 611,
  'SUIT SET', NULL,
  '/products/D3P_14/1_1.webp',
  ARRAY['/products/D3P_14/1_1.webp', '/products/D3P_14/2_1.webp', '/products/D3P_14/3_1.webp'],
  100,
  '{"S": "DEP-14-S", "M": "DEP-14-M", "L": "DEP-14-L", "XL": "DEP-14-XL", "XXL": "DEP-14-XXL"}'::jsonb, 'D3P-14',
  '[{"name": "Black", "code": "#000000"}]'::jsonb, 'Black', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'timeless-black-rayon-suit-d3p-14', 'Timeless Black Rayon Suit with Geometric Border Dupatta',
  'D3P-14', 5,
  'active', true
),
-- Product 15: Emerald Green Rayon Ensemble
(
  'Emerald Green Rayon Ensemble with Silver Floral Dupatta', 'Nplusone Fashion', 'D3P-15', NULL,
  'Look stunning in this Bottle Green Rayon Slub set. The dark green kurta is highlighted by a vertical silver embroidery strip on the neck. It pairs perfectly with a silver-grey based Chanderi Dupatta adorned with pink florals and a geometric border, creating a sophisticated color palette.',
  1299, 571,
  'SUIT SET', NULL,
  '/products/D3P_15/1_2.webp',
  ARRAY['/products/D3P_15/1_2.webp', '/products/D3P_15/2_2.webp', '/products/D3P_15/3_2.webp'],
  100,
  '{"S": "DEP-15-S", "M": "DEP-15-M", "L": "DEP-15-L", "XL": "DEP-15-XL", "XXL": "DEP-15-XXL"}'::jsonb, 'D3P-15',
  '[{"name": "Bottle Green", "code": "#006A4E"}]'::jsonb, 'Bottle Green', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'emerald-green-rayon-ensemble-d3p-15', 'Emerald Green Rayon Ensemble with Silver Floral Dupatta',
  'D3P-15', 5,
  'active', true
),
-- Product 16: Plum Purple Kurti Set
(
  'Plum Purple Kurti Set with Lace Detail & Floral Dupatta', 'Nplusone Fashion', 'D3P-16', NULL,
  'Stand out in this deep Plum Purple Rayon Slub suit. The yoke is heavily embroidered with traditional motifs, and the hem is finished with delicate lace work. The contrasting light pink/lilac Chanderi Dupatta features bold floral prints, adding a vibrant touch to the solid dark base.',
  1299, 571,
  'SUIT SET', NULL,
  '/products/D3P_16/1_4.webp',
  ARRAY['/products/D3P_16/1_4.webp', '/products/D3P_16/2_4.webp', '/products/D3P_16/4_2.webp', '/products/D3P_16/5_1.webp', '/products/D3P_16/06.webp'],
  100,
  '{"S": "DEP-16-S", "M": "DEP-16-M", "L": "DEP-16-L", "XL": "DEP-16-XL", "XXL": "DEP-16-XXL"}'::jsonb, 'D3P-16',
  '[{"name": "Maroon", "code": "#800000"}]'::jsonb, 'Maroon', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'plum-purple-kurti-set-d3p-16', 'Plum Purple Kurti Set with Lace Detail & Floral Dupatta',
  'D3P-16', 5,
  'active', true
),
-- Product 17: Modern Violet Rayon Suit
(
  'Modern Violet Rayon Suit with Geometric Print Dupatta', 'Nplusone Fashion', 'D3P-17', NULL,
  'A chic choice for the modern woman, this Violet Purple suit offers a contemporary silhouette. The neckline is adorned with geometric silver embroidery. It is paired with a matching dupatta featuring a mix of geometric and traditional prints in coordinating shades, offering a smart, monochromatic look.',
  1299, 551,
  'SUIT SET', NULL,
  '/products/D3P_17/1_5.webp',
  ARRAY['/products/D3P_17/1_5.webp', '/products/D3P_17/2_5.webp', '/products/D3P_17/3_5.webp', '/products/D3P_17/4_3.webp', '/products/D3P_17/5_2.webp'],
  100,
  '{"S": "DEP-17-S", "M": "DEP-17-M", "L": "DEP-17-L", "XL": "DEP-17-XL", "XXL": "DEP-17-XXL"}'::jsonb, 'D3P-17',
  '[{"name": "Royal Purple", "code": "#7851A9"}]'::jsonb, 'Royal Purple', ARRAY['S','M','L','XL','XXL'],
  'Rayon Slub', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'modern-violet-rayon-suit-d3p-17', 'Modern Violet Rayon Suit with Geometric Print Dupatta',
  'D3P-17', 5,
  'active', true
),
-- Product 18: Peacock Blue Kurti Set (No. 18)
(
  'Peacock Blue Kurti Set with Floral White Dupatta', 'Nplusone Fashion', 'D3P-18', NULL,
  'Embrace the hues of the ocean with this Peacock Blue (Teal) suit. The kurta features a silver embroidered yoke that contrasts beautifully with the blue fabric. The look is balanced with a white Chanderi Dupatta featuring refreshing pink and green floral prints and a geometric border.',
  1299, 611,
  'SUIT SET', NULL,
  '/products/D3P_18/1_6.webp',
  ARRAY['/products/D3P_18/1_6.webp', '/products/D3P_18/2_6.webp', '/products/D3P_18/3_6.webp', '/products/D3P_18/4_4.webp'],
  100,
  '{"S": "DEP-18-S", "M": "DEP-18-M", "L": "DEP-18-L", "XL": "DEP-18-XL", "XXL": "DEP-18-XXL"}'::jsonb, 'D3P-18',
  '[{"name": "Bottle Blue", "code": "#0047AB"}]'::jsonb, 'Bottle Blue', ARRAY['S','M','L','XL','XXL'],
  'Magic Cotton', 'Embroidery', 'Round Neck/Chanderi Digital Print Dupatta', '3/4 Sleeve', 'Straight', 'Pant', 'Pack of 3', 350, NULL,
  ARRAY['3 PIECE DRESS'], 'peacock-blue-kurti-set-d3p-18', 'Peacock Blue Kurti Set with Floral White Dupatta',
  'D3P-18', 5,
  'active', true
);
