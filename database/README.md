# FitTracker Database Documentation

## Overview
This directory contains the database schema, queries, and seed data for the FitTracker application.

## Database Structure

### Tables

#### users
Stores user account information and profile data.
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Encrypted password
- `first_name`, `last_name`: User's name
- `date_of_birth`, `gender`: Personal information
- `height`, `weight`: Physical metrics (cm, kg)
- `created_at`, `updated_at`: Timestamps

#### workout_types
Predefined workout categories.
- `id`: Primary key
- `name`: Workout type name (e.g., Running, Swimming)
- `description`: Detailed description
- `category`: Category (Cardio, Strength, etc.)

#### workouts
Individual workout sessions.
- `id`: Primary key
- `user_id`: Foreign key to users
- `workout_type_id`: Foreign key to workout_types
- `date`: Workout date
- `duration`: Duration in minutes
- `calories_burned`: Calories burned during workout
- `distance`: Distance covered (km)
- `notes`: Additional notes

#### goals
User fitness goals.
- `id`: Primary key
- `user_id`: Foreign key to users
- `goal_type`: Type of goal (weight, distance, calories, workouts)
- `target_value`: Target to achieve
- `current_value`: Current progress
- `start_date`, `end_date`: Goal timeframe
- `status`: active, completed, or cancelled

#### exercises
Detailed exercise information for each workout.
- `id`: Primary key
- `workout_id`: Foreign key to workouts
- `exercise_name`: Name of the exercise
- `sets`, `reps`: Set and repetition counts
- `weight`: Weight used (kg)
- `duration`: Exercise duration (seconds)

## Files

### schema.sql
Contains the complete database schema with all table definitions and indexes.

**Usage:**
```bash
sqlite3 fittracker.db < schema.sql
```

### queries.sql
Common SQL queries used throughout the application:
- Dashboard statistics
- Recent workouts
- Workout statistics by type
- Weekly summaries
- Goal tracking
- Monthly trends

### seed-data.sql
Sample data for development and testing:
- 15 predefined workout types
- Demo user account
- Sample workouts and exercises
- Example goals

**Usage:**
```bash
sqlite3 fittracker.db < seed-data.sql
```

### views.sql
Database views for complex queries:
- `user_workout_summary`: Overall user statistics
- `recent_workouts_view`: Recent workouts with details
- `workout_type_stats`: Statistics by workout type
- `active_goals_progress`: Goal progress tracking
- `weekly_workout_trends`: Weekly activity trends
- `user_performance_metrics`: Comprehensive user metrics

**Usage:**
```bash
sqlite3 fittracker.db < views.sql
```

## Setup Instructions

1. **Create the database:**
   ```bash
   sqlite3 fittracker.db
   ```

2. **Run the schema:**
   ```bash
   sqlite3 fittracker.db < schema.sql
   ```

3. **Load seed data (optional):**
   ```bash
   sqlite3 fittracker.db < seed-data.sql
   ```

4. **Create views (optional):**
   ```bash
   sqlite3 fittracker.db < views.sql
   ```

## Database Diagram

```
users (1) ─────< (N) workouts (N) >───── (1) workout_types
  │                    │
  │                    └──< (N) exercises
  │
  └─────< (N) goals
```

## Indexes
Indexes are created on frequently queried columns:
- `workouts.user_id`
- `workouts.date`
- `exercises.workout_id`
- `goals.user_id`

## Data Types
- Timestamps: SQLite TIMESTAMP (ISO 8601 format)
- Decimals: DECIMAL(precision, scale)
- Text: VARCHAR for limited strings, TEXT for longer content

## Notes
- All foreign keys use CASCADE on delete for workouts
- Timestamps auto-update on record modification
- Default values are set for status fields and timestamps
