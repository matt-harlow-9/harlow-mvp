const musicApp = {
    runApp: () => {
        const genreButton = $("#genreButton");
        const artistButton = $("#artistButton");
        const resultCard = $("#resultCard");
        genreButton.on('click', musicApp.genreHandler);
        artistButton.on('click', musicApp.artistHandler);
    },

    // Event handler for genre button click
    genreHandler: ()  => {
        runApp.emptyResults();
        let genreNum = $("#genreNum").val();
        fetch(`http://localhost:8004/genres/${genreNum}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0 || !data) {
                resultCard.append(`<h4>Genre Unavailable for Selection ${genreNum}</h4>`);
            } else {
                let genreResult = `
                <div class="genre-result">
                    <h3>Name: ${data[0].name}</h3>
                    <h3>Tempo: ${data[0].tempo}</h3>
                </div>`;
                resultCard.append(genreResult);
            }
        });
    },
    // Event handler for artist button click
    artistHandler: () => {
        runApp.emptyResults();
        let artistNum = $("#artistNum").val();
        fetch(`http://localhost:8004/artists/${artistNum}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0 || !data) {
                resultCard.append(`<h4>Artist Unavailable for Selection ${artistNum}</h4>`);
            } else {
                let artistResult = `
                <div class="artist-result">
                    <h3>Stage Name: ${data[0].stage_name}</h3>
                    <h3>Real Name: ${data[0].real_name}</h3>
                    <h3>Age: ${data[0].age}</h3>
                    <h3>Genre: </h3>
                </div>`;
                resultCard.append(artistResult);
            }
        })
    },
    emptyResults: () => {
        resultCard.empty();
    }
}

musicApp.runApp();