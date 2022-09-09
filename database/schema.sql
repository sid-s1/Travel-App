-- when first creating database:
-- start up psql in CLI by typing 'psql postgres'
-- create database by typing 'CREATE DATABASE tript;'
-- quit database with '\q'

-- on each refresh of db, insert this file by navigating to the project folder in the CLI
-- and using the following command: 
-- 'psql tript < database/schema.sql'

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    security_qn INT,
    security_ans TEXT,
    admin BOOLEAN
);

DROP TABLE IF EXISTS trips CASCADE;
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    trip_name TEXT,
    trip_type TEXT,
    trip_status TEXT,
    trip_start_date DATE,
    trip_end_date DATE,
    hero_image_url TEXT,
    description TEXT,
    key_takeaway TEXT
);

DROP TABLE IF EXISTS votes CASCADE;
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    trip_id INT REFERENCES trips(id),
    liked BOOLEAN
);

DROP TABLE IF EXISTS bookmarked CASCADE;
CREATE TABLE IF NOT EXISTS bookmarked (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    trip_id INT REFERENCES trips(id)
);

DROP TABLE IF EXISTS achievements CASCADE;
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name TEXT,
    point_value INT,
    badge_filename TEXT
);

DROP TABLE IF EXISTS user_achievements CASCADE;
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    achievement_id INT REFERENCES achievements(id)
);

DROP TABLE IF EXISTS countries CASCADE;
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    country_name TEXT,
    flag_img_file TEXT,
    language TEXT,
    currency TEXT
);

DROP TABLE IF EXISTS cities CASCADE;
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    country_id INT REFERENCES countries(id),
    gm_api_city_id TEXT,
    city_name TEXT
);


DROP TABLE IF EXISTS trip_locations CASCADE;
CREATE TABLE IF NOT EXISTS trip_locations (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id),
    city_id INT REFERENCES cities(id),
    city_start_date DATE,
    city_end_date DATE
);

DROP TABLE IF EXISTS user_countries CASCADE;
CREATE TABLE IF NOT EXISTS user_countries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    country_id INT REFERENCES countries(id)
);

DROP TABLE IF EXISTS activities CASCADE;
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    activity_name TEXT,
    gm_api_place_id TEXT,
    gm_type TEXT
);

DROP TABLE IF EXISTS itinerary_items CASCADE;
CREATE TABLE IF NOT EXISTS itinerary_items (
    id SERIAL PRIMARY KEY,
    trip_location_id INT REFERENCES trip_locations(id),
    activity_id INT REFERENCES activities(id),
    activity_start_date DATE,
    activity_end_date DATE,
    activity_rating INT
);