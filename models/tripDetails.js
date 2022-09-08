const db = require('../database/db');

const Trip = {
    details: (id) => {
        const sql = 'SELECT * FROM trips WHERE id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => err)
    },
    cityId: (id) => {
        const sql = 'SELECT city_id FROM trip_locations WHERE trip_id = $1';
        return db.query(sql, [id])
            .then(dbRes => {
                if (dbRes.rowCount === 1) {
                    return { city_id: dbRes.rows[0].city_id }
                }
                else {
                    return dbRes.rows
                }
            })
            .catch(err => err)
    },
    cityName: (id) => {
        const sql = 'SELECT city_name FROM cities WHERE id = $1';
        return db.query(sql, [id])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    },
    cityNames: (ids) => {
        console.log(ids);
        const sql = 'SELECT city_name FROM cities WHERE id in ($1)';
        return db.query(sql, [ids])
            .then(dbRes => dbRes)
            .catch(err => console.log(err))
    }
}

module.exports = Trip;

// const sql = 'SELECT city_name FROM cities WHERE id = $1';
// const cityId = dbRes.rows[0].city_id;
// return db.query(sql, [cityId])
//     .then(dbRes2 => dbRes2)
//     .catch(err => { err })
