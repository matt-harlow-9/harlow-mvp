DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name TEXT,
    tempo TEXT
);

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    stage_name TEXT,
    real_name TEXT,
    age INTEGER,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE
);