-- FitTracker Database Schema
-- PostgreSQL Version

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'Running', 'Cycling', 'Swimming', 'Yoga', 'Gym'
    duration INTEGER NOT NULL, -- in minutes
    calories_burned INTEGER NOT NULL,
    distance DECIMAL(10, 2), -- in kilometers (optional for some activities)
    workout_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_activity_type ON workouts(activity_type);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, workout_date);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
