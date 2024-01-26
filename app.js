import express from "express";
import pg from "pg";

const pool = new pg.Pool({
    host: 'localhost',
    port: 6432,
    user: 'postgres',
    password: 'postgres',
    database: 'music'
});

const PORT = 8004;

const app = express();

app.use(express.json());

app.get("/artists", (req, res, next) => {
    pool.query(`SELECT * FROM artists`)
        .then((data) => {
            console.log("All artists: \n", data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})