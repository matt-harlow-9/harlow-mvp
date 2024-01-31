export default (pool) => {
    // Get all artists
    const getAllArtists = async (req, res, next) => {
        console.log("Getting all artists");
        const artistQuery = `SELECT * FROM artists`;
        try {
            const data = await pool.query(artistQuery);
            console.log(data.rows);
            res.json(data.rows);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Get one artist by id
    const getArtistDetail = async (req, res, next) => {
        const artistId = Number.parseInt(req.params.artistId);
        console.log("Getting artist id: ", artistId);
        const artistQuery = `SELECT * FROM artists WHERE id = $1`;
        try {
            const data = await pool.query(artistQuery, [artistId]);
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

    // Create an artist by using data in the req body
    const createArtist = async (req, res, next) => {
        const artistId = Number.parseInt(req.params.artistId);
        const { stage_name, real_name } = req.body;
        const age = Number(req.body.age);
        const genre_id = Number(req.body.genre_id);
        // console.log(`Genre: ${name}, Tempo: ${tempo}`);
        // Return 400 error if stage name, real name, age, or genre_id absent
        if (!stage_name || !real_name || isNaN(age) ) {
            res.sendStatus(400);
            return;
        }
        console.log(`Creating artist with - Stage Name: ${stage_name}, Real Name: ${real_name}, Age: ${age}, Genre ID: ${genre_id}`);
        try {
            const data = await pool.query(`INSERT INTO artists (stage_name, real_name, age, genre_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [stage_name, real_name, age, genre_id]);
            const artist = data.rows[0];
            res.json(artist);
        } catch(error) {
            console.log(error);
            // next(err);
            res.sendStatus(500);
        }
    }

    // Update artist by id, using data in request body
    const updateArtist = async (req, res, next) => {
        const artistId = Number.parseInt(req.params.artistId);
        const { stage_name, real_name } = req.body;
        const age = Number(req.body.age);
        const genre_id = Number(req.body.genre_id);
        // Make sure artistId to update exists
        if (Number.isNaN(artistId)) {
            res.sendStatus(400);
            return;
        }
        console.log("Changing artist with id: ", artistId);
        const query = 
            `UPDATE artists SET
                stage_name = COALESCE($1, stage_name),
                real_name = COALESCE($2, real_name),
                age = COALESCE($3, age),
                genre_id = COALESCE($4, genre_id)
            WHERE id = $5 RETURNING *`;
        try {
            const data = await pool.query(query, [stage_name, real_name, age, genre_id]);
            if (data.rows.length === 0) {
                res.sendStatus(404);
                return;
            }
            // Artist updated OK - send to client
            console.log("Artist updated: \n", data.rows[0]);
            res.json(data.rows[0]);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    }

    // Delete artist by id
    const deleteArtist = async (req, res, next) => {
        const artistId = Number.parseInt(req.params.artistId);
        console.log("id: ", artistId);
        if (Number.isNaN(artistId)) {
            res.sendStatus(400);
            return;
        }
        console.log("Deleting artist with id ", artistId);
        try {
            const data = await pool.query(`DELETE FROM artists WHERE id = $1 RETURNING *`, [artistId]);
            if (data.rows.length === 0) {
                console.log("No artist found with that id");
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

    // // Get all artists and genre name for a genreId
    // const getGenreArtists = async (req, res, next) => {
    //     const genreId = Number.parseInt(req.params.genreId);
    //     console.log(`Getting all artists for genre ${genreId}`);
    //     const genreQuery =
    //         `SELECT
    //             genres.name as genre_name,
    //             artists.stage_name as state_name,
    //             artists.id as artist_id,
    //             artists.real_name as real_name,
    //             artists.age as age
    //         FROM genres INNER JOIN artists ON artists.genre_id = genres.id WHERE genre_id = $1`;
    //     try {
    //         const data = await pool.query(genreQuery, [genreId]);
    //         console.log(data.rows);
    //         res.json(data.rows);
    //     } catch (error) {
    //         console.log(error);
    //         // next (error);
    //         res.sendStatus(500);
    //     }
    // }

    return {
        getAllArtists,
        getArtistDetail,
        createArtist,
        updateArtist,
        deleteArtist
    }
}