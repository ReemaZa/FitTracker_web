-- FitTracker Sample Data
-- Insert sample user and workout data for testing

-- Insert sample user
INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@fittracker.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890')
ON CONFLICT (username) DO NOTHING;

-- Get the user ID (assuming it's 1 for this example, adjust as needed)
DO $$
DECLARE
    test_user_id INTEGER;
BEGIN
    SELECT id INTO test_user_id FROM users WHERE username = 'testuser' LIMIT 1;
    
    -- Insert sample workouts for the last 30 days
    -- Running workouts
    INSERT INTO workouts (user_id, activity_type, duration, calories_burned, distance, workout_date, notes) VALUES
    (test_user_id, 'Running', 45, 420, 6.5, CURRENT_DATE - INTERVAL '1 day', 'Morning jog in the park'),
    (test_user_id, 'Running', 60, 580, 8.2, CURRENT_DATE - INTERVAL '3 days', 'Long distance run'),
    (test_user_id, 'Running', 30, 290, 4.0, CURRENT_DATE - INTERVAL '5 days', 'Quick evening run'),
    (test_user_id, 'Running', 50, 480, 7.0, CURRENT_DATE - INTERVAL '8 days', 'Trail running'),
    (test_user_id, 'Running', 40, 380, 5.5, CURRENT_DATE - INTERVAL '12 days', 'Tempo run'),
    (test_user_id, 'Running', 55, 520, 7.5, CURRENT_DATE - INTERVAL '15 days', 'Weekend long run'),
    (test_user_id, 'Running', 35, 330, 4.8, CURRENT_DATE - INTERVAL '19 days', 'Recovery run'),
    (test_user_id, 'Running', 45, 420, 6.0, CURRENT_DATE - INTERVAL '22 days', 'Morning run'),
    (test_user_id, 'Running', 50, 470, 6.8, CURRENT_DATE - INTERVAL '26 days', 'Interval training'),
    (test_user_id, 'Running', 40, 380, 5.3, CURRENT_DATE - INTERVAL '29 days', 'Easy run');

    -- Cycling workouts
    INSERT INTO workouts (user_id, activity_type, duration, calories_burned, distance, workout_date, notes) VALUES
    (test_user_id, 'Cycling', 60, 450, 18.5, CURRENT_DATE - INTERVAL '2 days', 'Bike path ride'),
    (test_user_id, 'Cycling', 90, 720, 28.0, CURRENT_DATE - INTERVAL '6 days', 'Long weekend ride'),
    (test_user_id, 'Cycling', 45, 350, 14.2, CURRENT_DATE - INTERVAL '10 days', 'Hill training'),
    (test_user_id, 'Cycling', 75, 580, 22.5, CURRENT_DATE - INTERVAL '14 days', 'Group ride'),
    (test_user_id, 'Cycling', 50, 380, 15.8, CURRENT_DATE - INTERVAL '18 days', 'Commute workout'),
    (test_user_id, 'Cycling', 65, 500, 20.0, CURRENT_DATE - INTERVAL '23 days', 'Evening ride'),
    (test_user_id, 'Cycling', 80, 620, 25.3, CURRENT_DATE - INTERVAL '27 days', 'Endurance training');

    -- Swimming workouts
    INSERT INTO workouts (user_id, activity_type, duration, calories_burned, distance, workout_date, notes) VALUES
    (test_user_id, 'Swimming', 45, 380, 1.5, CURRENT_DATE, 'Lap swimming'),
    (test_user_id, 'Swimming', 50, 420, 1.8, CURRENT_DATE - INTERVAL '4 days', 'Technique practice'),
    (test_user_id, 'Swimming', 40, 340, 1.3, CURRENT_DATE - INTERVAL '9 days', 'Easy swim'),
    (test_user_id, 'Swimming', 55, 460, 2.0, CURRENT_DATE - INTERVAL '13 days', 'Interval sets'),
    (test_user_id, 'Swimming', 45, 380, 1.6, CURRENT_DATE - INTERVAL '20 days', 'Endurance swim'),
    (test_user_id, 'Swimming', 50, 420, 1.7, CURRENT_DATE - INTERVAL '25 days', 'Pool workout');

    -- Yoga workouts
    INSERT INTO workouts (user_id, activity_type, duration, calories_burned, distance, workout_date, notes) VALUES
    (test_user_id, 'Yoga', 60, 180, NULL, CURRENT_DATE - INTERVAL '1 day', 'Vinyasa flow'),
    (test_user_id, 'Yoga', 45, 135, NULL, CURRENT_DATE - INTERVAL '7 days', 'Power yoga'),
    (test_user_id, 'Yoga', 60, 180, NULL, CURRENT_DATE - INTERVAL '11 days', 'Hatha yoga'),
    (test_user_id, 'Yoga', 50, 150, NULL, CURRENT_DATE - INTERVAL '16 days', 'Restorative yoga'),
    (test_user_id, 'Yoga', 45, 135, NULL, CURRENT_DATE - INTERVAL '21 days', 'Morning flow'),
    (test_user_id, 'Yoga', 60, 180, NULL, CURRENT_DATE - INTERVAL '28 days', 'Yin yoga');

    -- Gym workouts
    INSERT INTO workouts (user_id, activity_type, duration, calories_burned, distance, workout_date, notes) VALUES
    (test_user_id, 'Gym', 75, 520, NULL, CURRENT_DATE - INTERVAL '2 days', 'Strength training - upper body'),
    (test_user_id, 'Gym', 60, 440, NULL, CURRENT_DATE - INTERVAL '4 days', 'Leg day'),
    (test_user_id, 'Gym', 70, 490, NULL, CURRENT_DATE - INTERVAL '9 days', 'Full body workout'),
    (test_user_id, 'Gym', 65, 460, NULL, CURRENT_DATE - INTERVAL '11 days', 'HIIT session'),
    (test_user_id, 'Gym', 80, 560, NULL, CURRENT_DATE - INTERVAL '17 days', 'Strength and cardio'),
    (test_user_id, 'Gym', 55, 390, NULL, CURRENT_DATE - INTERVAL '24 days', 'Core workout'),
    (test_user_id, 'Gym', 70, 490, NULL, CURRENT_DATE - INTERVAL '30 days', 'Circuit training');

END $$;

-- Verify data insertion
SELECT 
    activity_type,
    COUNT(*) as workout_count,
    ROUND(AVG(duration)::numeric, 0) as avg_duration,
    ROUND(AVG(calories_burned)::numeric, 0) as avg_calories
FROM workouts
GROUP BY activity_type
ORDER BY workout_count DESC;
