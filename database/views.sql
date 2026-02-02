-- FitTracker Database Views
-- Aggregation views for dashboard analytics

-- View 1: Daily Workout Aggregates
CREATE OR REPLACE VIEW vw_daily_workout_aggregates AS
SELECT 
    user_id,
    workout_date,
    COUNT(*) as total_workouts,
    SUM(duration) as total_duration,
    SUM(calories) as total_calories,
    SUM(COALESCE(distance, 0)) as total_distance,
    ARRAY_AGG(DISTINCT activity_type) as activities
FROM workouts
GROUP BY user_id, workout_date
ORDER BY workout_date DESC;

-- View 2: Weekly Workout Aggregates
CREATE OR REPLACE VIEW vw_weekly_workout_aggregates AS
SELECT 
    user_id,
    DATE_TRUNC('week', workout_date) as week_start,
    COUNT(*) as total_workouts,
    SUM(duration) as total_duration,
    SUM(calories) as total_calories,
    SUM(COALESCE(distance, 0)) as total_distance,
    ROUND(AVG(duration)::numeric, 0) as avg_duration,
    ARRAY_AGG(DISTINCT activity_type) as activities
FROM workouts
GROUP BY user_id, DATE_TRUNC('week', workout_date)
ORDER BY week_start DESC;

-- View 3: Monthly Workout Aggregates
CREATE OR REPLACE VIEW vw_monthly_workout_aggregates AS
SELECT 
    user_id,
    DATE_TRUNC('month', workout_date) as month_start,
    EXTRACT(MONTH FROM workout_date) as month,
    EXTRACT(YEAR FROM workout_date) as year,
    COUNT(*) as total_workouts,
    SUM(duration) as total_duration,
    SUM(calories) as total_calories,
    SUM(COALESCE(distance, 0)) as total_distance,
    ROUND(AVG(duration)::numeric, 0) as avg_duration
FROM workouts
GROUP BY user_id, DATE_TRUNC('month', workout_date), EXTRACT(MONTH FROM workout_date), EXTRACT(YEAR FROM workout_date)
ORDER BY month_start DESC;

-- View 4: Activity Type Summary
CREATE OR REPLACE VIEW vw_activity_type_summary AS
SELECT 
    user_id,
    activity_type,
    COUNT(*) as total_count,
    SUM(duration) as total_duration,
    SUM(calories) as total_calories,
    SUM(COALESCE(distance, 0)) as total_distance,
    ROUND(AVG(duration)::numeric, 0) as avg_duration,
    ROUND(AVG(calories)::numeric, 0) as avg_calories
FROM workouts
GROUP BY user_id, activity_type
ORDER BY total_count DESC;

-- View 5: User Dashboard Stats (Last 30 days)
CREATE OR REPLACE VIEW vw_user_dashboard_stats AS
SELECT 
    user_id,
    COUNT(*) as total_workouts,
    SUM(duration) as total_duration,
    SUM(calories) as total_calories,
    SUM(COALESCE(distance, 0)) as total_distance,
    ROUND(AVG(duration)::numeric, 0) as avg_duration,
    MAX(workout_date) as last_workout_date,
    MIN(workout_date) as first_workout_date
FROM workouts
WHERE workout_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id;
