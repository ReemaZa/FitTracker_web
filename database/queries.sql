-- FitTracker Dashboard Queries
-- SQL queries for each NestJS endpoint

-- ============================================================
-- 1. GET /api/dashboard/stats
-- Returns: Overall statistics for the last 30 days
-- ============================================================
SELECT 
    COUNT(*) as total_workouts,
    COALESCE(SUM(duration), 0) as total_duration,
    COALESCE(SUM(calories_burned), 0) as total_calories,
    COALESCE(ROUND(AVG(duration)::numeric, 0), 0) as avg_duration,
    -- Calculate trend (comparison with previous 30 days)
    (
        SELECT COUNT(*) 
        FROM workouts 
        WHERE user_id = $1 
        AND workout_date BETWEEN CURRENT_DATE - INTERVAL '60 days' AND CURRENT_DATE - INTERVAL '31 days'
    ) as previous_period_workouts
FROM workouts
WHERE user_id = $1 
AND workout_date >= CURRENT_DATE - INTERVAL '30 days';

-- ============================================================
-- 2. GET /api/dashboard/workout-data/weekly
-- Returns: Daily workout data for the last 7 days
-- ============================================================
WITH date_series AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        '1 day'::interval
    )::date as workout_date
)
SELECT 
    TO_CHAR(ds.workout_date, 'Mon DD') as label,
    ds.workout_date as date,
    COALESCE(COUNT(w.id), 0) as workouts,
    COALESCE(SUM(w.duration), 0) as duration,
    COALESCE(SUM(w.calories_burned), 0) as calories
FROM date_series ds
LEFT JOIN workouts w ON w.workout_date = ds.workout_date AND w.user_id = $1
GROUP BY ds.workout_date
ORDER BY ds.workout_date;

-- ============================================================
-- 3. GET /api/dashboard/workout-data/monthly
-- Returns: Weekly aggregated data for the last 4 weeks
-- ============================================================
WITH week_series AS (
    SELECT 
        generate_series(
            DATE_TRUNC('week', CURRENT_DATE - INTERVAL '3 weeks'),
            DATE_TRUNC('week', CURRENT_DATE),
            '1 week'::interval
        )::date as week_start
)
SELECT 
    'Week ' || EXTRACT(WEEK FROM ws.week_start)::text as label,
    ws.week_start as date,
    COALESCE(COUNT(w.id), 0) as workouts,
    COALESCE(SUM(w.duration), 0) as duration,
    COALESCE(SUM(w.calories_burned), 0) as calories
FROM week_series ws
LEFT JOIN workouts w 
    ON DATE_TRUNC('week', w.workout_date) = ws.week_start 
    AND w.user_id = $1
GROUP BY ws.week_start
ORDER BY ws.week_start;

-- ============================================================
-- 4. GET /api/dashboard/activity-breakdown
-- Returns: Activity type distribution
-- ============================================================
WITH activity_stats AS (
    SELECT 
        activity_type,
        COUNT(*) as count,
        SUM(duration) as total_duration,
        SUM(calories_burned) as total_calories
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY activity_type
),
total_workouts AS (
    SELECT COUNT(*) as total
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
    a.activity_type as type,
    a.count,
    ROUND((a.count::numeric / NULLIF(t.total, 0) * 100)::numeric, 0) as percentage,
    CASE a.activity_type
        WHEN 'Running' THEN '#FF6B6B'
        WHEN 'Cycling' THEN '#4ECDC4'
        WHEN 'Swimming' THEN '#45B7D1'
        WHEN 'Yoga' THEN '#FFA07A'
        WHEN 'Gym' THEN '#9C27B0'
        ELSE '#95E1D3'
    END as color
FROM activity_stats a
CROSS JOIN total_workouts t
ORDER BY a.count DESC;

-- ============================================================
-- 5. GET /api/dashboard/summary/weekly
-- Returns: Summary statistics for the current week
-- ============================================================
WITH current_week AS (
    SELECT 
        COUNT(*) as workouts,
        COALESCE(SUM(calories_burned), 0) as calories,
        COALESCE(ROUND(AVG(duration)::numeric, 0), 0) as avg_duration
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= DATE_TRUNC('week', CURRENT_DATE)
),
most_active AS (
    SELECT 
        TO_CHAR(workout_date, 'Day') as day_name,
        COUNT(*) as workout_count
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= DATE_TRUNC('week', CURRENT_DATE)
    GROUP BY workout_date
    ORDER BY workout_count DESC
    LIMIT 1
)
SELECT 
    cw.workouts as total_workouts,
    cw.calories as total_calories,
    cw.avg_duration as avg_duration,
    COALESCE(TRIM(ma.day_name), 'N/A') as most_active_day
FROM current_week cw
LEFT JOIN most_active ma ON true;

-- ============================================================
-- 6. GET /api/dashboard/summary/monthly
-- Returns: Summary statistics for the current month
-- ============================================================
WITH current_month AS (
    SELECT 
        EXTRACT(MONTH FROM CURRENT_DATE)::integer as month,
        EXTRACT(YEAR FROM CURRENT_DATE)::integer as year,
        COUNT(*) as total_workouts,
        COALESCE(SUM(calories_burned), 0) as total_calories,
        COALESCE(SUM(COALESCE(distance, 0)), 0) as total_distance
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= DATE_TRUNC('month', CURRENT_DATE)
),
weeks_in_month AS (
    SELECT 
        COUNT(DISTINCT DATE_TRUNC('week', workout_date)) as week_count
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= DATE_TRUNC('month', CURRENT_DATE)
),
top_activity AS (
    SELECT activity_type
    FROM workouts
    WHERE user_id = $1 
    AND workout_date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY activity_type
    ORDER BY COUNT(*) DESC
    LIMIT 1
)
SELECT 
    TO_CHAR(TO_DATE(cm.month::text, 'MM'), 'Month') as month,
    cm.year,
    cm.total_workouts,
    cm.total_calories,
    ROUND(cm.total_distance::numeric, 1) as total_distance,
    ROUND((cm.total_workouts::numeric / NULLIF(wm.week_count, 0))::numeric, 1) as avg_workouts_per_week,
    COALESCE(ta.activity_type, 'N/A') as top_activity
FROM current_month cm
CROSS JOIN weeks_in_month wm
LEFT JOIN top_activity ta ON true;
