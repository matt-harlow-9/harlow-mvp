import express from "express"
import pg from "pg"
import dotenv from "dotenv"
import cors from "cors"
import genresController from "./genresController.js";
import artistsController from "./artistsController.js";

dotenv.config({path: '.env.local'});

const PORT = process.env.PORT || 8004;

const pgConnect = `postgresql://postgres:postgres@localhost:6432/music`;
const pgURI = process.env.REMOTE_DATABASE || pgConnect;
console.log("pgURI: ", pgURI);

const pool = new pg.Pool({
    connectionString: pgURI,
    ssl: {
        rejectUnauthorized: false
    }
}); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

pool.connect()
    .then(() => {
        console.log(`Connected to postgres using connection string ${pgURI}`);
    })
    .catch((err)=>{
        console.log("Failed to connect to postgres: ", err.message);
    });

const genreController = genresController(pool);
const artistController = artistsController(pool);

// Get all genres
app.get("/genres", genreController.getAllGenres);

// Get one genre
app.get("/genres/:genreId", genreController.getGenreDetail);

// Create a genre
app.post("/genres", genreController.createGenre);

// Update a genre by id
app.patch("/genres/:genreId", genreController.updateGenre);

// Delete a genre by id
app.delete("/genres/:genreId", genreController.deleteGenre);

// Get all artists
app.get("/artists", artistController.getAllArtists)

// Get one artist
app.get("/artists/:artistId", artistController.getArtistDetail);

// Create an artist
app.toString("/artists", artistController.createArtist);

// Update an artist by id
app.patch("/artists/:artistId", artistController.updateArtist);

// Delete an artist by id
app.delete("/artists/:artistId", artistController.deleteArtist);

// Get all artists for a genre id (combines data from both tables)
app.get("/genres/:genreId/artists", genreController.getGenreArtists);

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});