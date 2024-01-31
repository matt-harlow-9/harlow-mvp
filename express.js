import express from "express"
import pg from "pg"
import dotenv from "dotenv"
import genresController from "./genresController.js";
import artistsController from "./artistsController.js";
import artistsController from "./artistsController.js";

dotenv.config({path: '.env.local'});

const PORT = process.env.PORT || 8003;

const pgConnect = `postgresql://postgres:postgres@localhost:6432/music`;
const pgURI = process.env.REMOTE_DATABASE || pgConnect;
console.log("pgURI: ", pgURI);

const pool = new pg.Pool({
    connectionString: pgURI,
}); 

pool.connect()
    .then((client) => {
        console.log(`Connected to postgres using connection string ${pgURI}`);
        client.release();
    })
    .catch((err)=>{
        console.log("Failed to connect to postgres: ", err.message);
    })

const app = express();
app.use(express.json());
app.use(express.static('public'));

const genresController = genresController(pool);
const artistsController = artistsController(pool);

// Get all genres
app.get("/genres", genresController.getAllGenres);

// Get one genre
app.get("/genres/:genreId", genresController.getGenreDetail);

// Create a genre
app.post("/genres", genresController.createGenre);

// Update a genre by id
app.patch("/genres/:genreId", genresController.updateGenre);

// Delete a genre by id
app.delete("/genres/:genreId", genresController.deleteGenre);

// Get all artists
app.get("/artists", artistsController.getAllArtists)

// Get one artist
app.get("/artists/:artistId", artistsController.getArtistDetail);

// Create an artist
app.toString("/artists", artistsController.createArtist);

// Update an artist by id
app.patch("/artists/:artistId", artistsController.updateArtist);

// Delete an artist by id
app.delete("/artists/artistId", artistsController.deleteArtist);

// Get all artists for a genre id (combines data from both tables)
app.get("/genres/:genreId/artists", genresController.getGenreArtists);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});