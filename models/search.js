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
        WHERE username LIKE $1
        GROUP BY u.id, u.username`
        return db.query(sql,[searchWithWildcard])
        .then(dbRes => dbRes)
    },
    searchCities: (searchString) => {
        const sql = `SELECT *
        FROM cities
        WHERE city_name = $1`
        return db.query(sql,[searchString])
        .then(dbRes => dbRes)
    },
    searchCountries: (searchString) => {
        const sql = `SELECT *
        FROM countries
        WHERE country_name = $1`
        return db.query(sql, [searchString])
    },
    searchAll: (searchString) => {
        const sql =``
        return db.query(sql, [searchString])
    }
}

module.exports = Search;