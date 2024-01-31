export default (pool) => {
    const getAllGenres = async (req, res, next) => {
        console.log("Getting all genres");
        const genreQuery = `SELECT * FROM genres`;
        try {
            const data = await pool.query(genreQuery);
            console.log(data.rows);
            res.json(data.rows);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get one genre by id
    const getGenreDetail = async (req, res, next) => {
        const genreId = req.params.genreId;
        console.log("Getting genres id: ", genreId);
        const genreQuery = `SELECT * FROM genres WHERE id = $1`;
        try {
            const data = await pool.query(genreQuery, [genreId]);
            console.log(data.rows);
            if (data.rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.json(data.rows);
        } catch (error) {
            console.log(error);
            //next(error);  // This was commented out on Slack
            res.sendStatus(500)
        }
    }

    // Create a genre by using data in the req body
    const createGenre = async (req, res, next) => {
        const { name, tempo } = req.body;
        console.log(`Genre: ${name}, Tempo: ${tempo}`);
        // Return 40 error if genre or tempo absent
        if (!name || !tempo) {
            res.sendStatus(400);
            return;
        }
        console.log(`Creating genre with - Genre: ${name}, Tempo: ${tempo}`);
        try {
            const data = await pool.query(`INSERT INTO genres (genre, tempo) VALUES ($1, $2) RETURNING *`,
            [name, tempo]);
            const genre = data.rows[0];
            res.json(genre);
        } catch(error) {
            console.log(error);
            // next(err);
            res.sendStatus(500);
        }
    }

    // Update genre by id, using data in request body
    const updateGenre = async (req, res, next) => {
        const genreId = Number.parseInt(req.params.genreId);
        const { genre, tempo } = req.body;
        // Make sure genre_id to update exists
        if (Number.isNaN(genreId)) {
            res.sendStatus(400);
            return;
        }
        console.log("Changing genre with id: ", genreId);
        const query = 
            `UPDATE genres SET
                name = COALESCE($1, name),
                tempo = COALESCE($2, tempo)
            WHERE id = $3 RETURNING *`;
        try {
            const data = await pool.query(query, [name, tempo, genreId]);
            if (data.rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            // Genre updated OK - send to client
            console.log("Genre updated: \n", data.rows[0]);
            res.json(data.rows[0]);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    }

    // Delete genre by id
    const deleteGenre = async (req, res, next) => {
        const genreId = Number.parseInt(req.params.genreId);
        console.log("id: ", genreId);
        if (Number.isNaN(genreId)) {
            res.sendStatus(400);
            return;
        }
        console.log("Deleting genre with id ", genreId);
        try {
            const data = await pool.query(`DELETE FROM genres WHERE id = $1 RETURNING *`, [genreId]);
            if (data.rows.length === 0) {
                console.log("No genre found with that id");
                res.sendStatus(404);
            } else {
                console.log("Deleted owner: \n", data.rows[0]);
                res.json(data.rows[0]);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    // Get all artists and genre name for a genreId
    const getGenreArtists = async (req, res, next) => {
        const genreId = Number.parseInt(req.params.genreId);
        console.log(`Getting all artists for genre ${genreId}`);
        const genreQuery =
            `SELECT
                genres.name as genre_name,
                artists.stage_name as state_name,
                artists.id as artist_id,
                artists.real_name as real_name,
                artists.age as age
            FROM genres INNER JOIN artists ON artists.genre_id = genres.id WHERE genre_id = $1`;
        try {
            const data = await pool.query(genreQuery, [genreId]);
            console.log(data.rows);
            res.json(data.rows);
        } catch (error) {
            console.log(error);
            // next (error);
            res.sendStatus(500);
        }
    }

    return {
        getAllGenres,
        getGenreDetail,
        getGenreArtists,
        createGenre,
        updateGenre,
        deleteGenre
    }
}