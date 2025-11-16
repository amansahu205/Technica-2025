-- Schema Update: Add Module Support to Lessons
-- This adds curriculum module grouping to the lessons table

-- Add module fields to lessons table
ALTER TABLE lessons ADD COLUMN module_number INTEGER;
ALTER TABLE lessons ADD COLUMN module_title TEXT;
ALTER TABLE lessons ADD COLUMN module_description TEXT;

-- Create index for efficient module queries
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_number, day);
