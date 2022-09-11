const db = require("../database/db");

const Search = {
    searchUsers: (searchString) => {
        const searchWithWildcard = `%${searchString}%`
        const sql = `SELECT u.id user_id, u.username, COUNT(ua.id) achievement_count, COUNT(t.id) trip_count, COUNT(uc.id) country_count
        FROM users u
        LEFT JOIN user_achievements ua
        ON u.id=ua.user_id
        LEFT JOIN achievements a
        ON ua.achievement_id=a.id
        LEFT JOIN user_countries uc
        ON u.id=uc.user_id
        LEFT JOIN trips t
        ON u.id=t.user_id
        WHERE LOWER(username) LIKE $1
        GROUP BY u.id, u.username`
        return db.query(sql,[searchWithWildcard])
        .then(dbRes => dbRes)
    },
    searchCities: (searchString) => {
        const searchWithWildcard = `%${searchString}%`
        const sql = `SELECT trip_id
        FROM cities c
        JOIN trip_locations tl
        ON c.id=tl.city_id
        WHERE LOWER(city_name) LIKE $1`
        return db.query(sql,[searchWithWildcard])
        .then(dbRes => dbRes)
    },
    searchCountries: (searchString) => {
        const searchWithWildcard = `%${searchString}%`
        const sql = `SELECT tl.trip_id
        FROM countries ct
        JOIN cities c
        ON ct.id=c.country_id
        JOIN trip_locations tl
        ON c.id=tl.city_id
        WHERE LOWER(country_name) LIKE $1`
        return db.query(sql, [searchWithWildcard])
    },
    searchActivities: (searchString) => {
        const searchWithWildcard = `%${searchString}%`
        const sql =`SELECT *
        FROM activities a
        JOIN itinerary_items ii
        ON a.id = ii.activity_id
        JOIN trip_locations tl
        ON ii.trip_location_id=tl.id
        WHERE LOWER(activity_name) LIKE $1`
        return db.query(sql, [searchWithWildcard])
    }
}

module.exports = Search;