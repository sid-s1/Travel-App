-- after inserting the schema into the db, insert this file by navigating to the project folder in the CLI 
-- and using the following command:
-- 'psql tript < database/seed.sql'
-- Note: passwords for users are same as usernames

TRUNCATE users restart identity cascade;
INSERT INTO users(username, email, password, security_qn, security_ans, profile_pic, admin) VALUES
('chris', 'chris@ga.com', '$2b$10$wc..uujGo3b3ceXnN80tzOYaWuPXQKu.0GoEWdc2jKVi47g91xDAi', 1, 'test', null, 't'),
('sid', 'sid@ga.com', '$2b$10$dhxz25GjwVgV2YkgJxBK8eWPxoSjOJywSdnRXfbz78WYXvlj7el6S', 2,'test', null, 't'),
('dave', 'dave@ga.com', '$2b$10$ng..DJ0BE9VdUvUTk3.dqunsplnc673tHnT9I/g3tY4aD7LgWzCnK', 3,'test', null, 't'),
('sam', 'sam@ga.com', '$2b$10$kfi/.jZLiYM6hBWEagFvgeaN/IKSJFFdNuop0IhTbyGHYOMGZxY6G', 4,'test', null, 'f');

TRUNCATE trips restart identity cascade;
INSERT INTO trips(user_id, trip_name, trip_type, trip_status, trip_start_date, trip_end_date, hero_image_url, description, key_takeaway) VALUES
(1, 'My Ski Adventure', 'active', 'posted', '2019-01-24', '2019-02-12', 'https://images.unsplash.com/photo-1465220183275-1faa863377e3', 'This trip was so awesome, we skiied night and day.','Skiing is fun.'),
(2, 'European summer escape', 'leisure', 'draft', '2021-06-22', '2021-07-03', 'https://images.unsplash.com/photo-1595704313515-e345a1cbdaa2', 'Summer in Italy and France.','I like Gelato.'),
(3, 'Eurovision trip', 'weekender', 'posted', '2018-05-19', '2018-05-21', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', 'Eurovision 2018! A great weekend away.','Switzerland was robbed!');

TRUNCATE votes restart identity cascade;
INSERT INTO votes(user_id, trip_id, liked) VALUES
(1, 1, 't');

TRUNCATE bookmarked restart identity cascade;
INSERT INTO bookmarked(user_id, trip_id) VALUES
(2, 1);

TRUNCATE achievements restart identity cascade;
INSERT INTO achievements(name, point_value, badge_filename) VALUES
('achievement test', 15, 'badge_filename.img');

TRUNCATE user_achievements restart identity cascade;
INSERT INTO user_achievements(user_id, achievement_id) VALUES
(1, 1);

TRUNCATE countries restart identity cascade;
INSERT INTO countries(country_name, flag_img_file, language, currency) VALUES
('Australia', 'aussie_flag.img', 'English', 'AUD'),
('Switzerland', 'swiss_flag.img', 'German', 'CHF');

TRUNCATE cities restart identity cascade;
INSERT INTO cities(country_id, gm_api_city_id, city_name) VALUES
(1, 'gm_code_sydney', 'Sydney'),
(1, 'gm_code_brisbane', 'Brisbane'),
(1,'gm_code_melbourne','Melbourne'),
(1,'gm_code_adelaide','Adelaide'),
(2,'gm_code_geneva','Geneva');

TRUNCATE trip_locations restart identity cascade;
INSERT INTO trip_locations(trip_id, city_id, city_start_date, city_end_date) VALUES
(1, 1, '2019-01-24', '2019-01-25'),
(1, 2,'2019-01-26','2019-01-27'),
(1, 3,'2019-01-28','2019-01-29'),
(2, 5,'2020-01-29','2020-02-04');

TRUNCATE user_countries restart identity cascade;
INSERT INTO user_countries(user_id, country_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1);

TRUNCATE activities restart identity cascade;
INSERT INTO activities(activity_name, gm_api_place_id, gm_type) VALUES
('Flight to Brisbane', 'gm_api_place_id', 'Flight'),
('Brisbane Snowboarding', 'gm_api_place_id', 'Business'),
('Hotel in Brisbane', 'gm_api_place_id', 'Hotel'),
('Flight to Adelaide', 'gm_api_place_id', 'Flight'),
('Hotel in Adelaide', 'gm_api_place_id', 'Hotel'),
('Adelaide Paragliding', 'gm_api_place_id', 'Business'),
('Flight to Geneva', 'gm_api_place_id', 'Flight'),
('Hotel in Geneva', 'gm_api_place_id', 'Hotel'),
('Geneva Climbing', 'gm_api_place_id', 'Business');

TRUNCATE itinerary_items restart identity cascade;
INSERT INTO itinerary_items(trip_location_id, activity_id, activity_start_date, activity_end_date, activity_rating) VALUES
(1, 1, '2019-01-24', '2019-01-24', 5),
(2, 2, '2019-01-25', '2019-01-25', 3),
(2, 3, '2019-01-25', '2019-01-26', 3),
(2, 4, '2019-01-26', '2019-01-27', 5),
(3, 5, '2019-01-28', '2019-01-29', 5),
(3, 6, '2019-01-29', '2019-01-29', 4),
(4, 7, '2020-01-29', '2019-01-30', 5),
(4, 8, '2019-01-30', '2019-02-04', 5),
(4, 9, '2019-02-02', '2020-02-03', 5);