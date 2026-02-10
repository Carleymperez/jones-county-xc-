CREATE TABLE athletes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade INTEGER,
    personal_record TEXT,
    events TEXT
);

CREATE TABLE meets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT,
    location TEXT
);

CREATE TABLE results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    athlete_id INTEGER,
    meet_id INTEGER,
    time TEXT,
    place INTEGER,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (meet_id) REFERENCES meets(id)
);
