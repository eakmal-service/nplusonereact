-- Add columns for shipping tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS awb_number TEXT,
ADD COLUMN IF NOT EXISTS courier_name TEXT DEFAULT 'iThinkLogistics',
ADD COLUMN IF NOT EXISTS logistic_order_id TEXT;
