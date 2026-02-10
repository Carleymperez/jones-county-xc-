-- name: GetAllAthletes :many
SELECT * FROM athletes ORDER BY name;

-- name: GetAthleteByID :one
SELECT * FROM athletes WHERE id = ? LIMIT 1;

-- name: CreateAthlete :one
INSERT INTO athletes (name, grade, personal_record, events)
VALUES (?, ?, ?, ?)
RETURNING *;

-- name: UpdateAthlete :one
UPDATE athletes
SET name = ?, grade = ?, personal_record = ?, events = ?
WHERE id = ?
RETURNING *;

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;

-- name: GetAllMeets :many
SELECT * FROM meets ORDER BY date;

-- name: GetMeetByID :one
SELECT * FROM meets WHERE id = ? LIMIT 1;

-- name: CreateMeet :one
INSERT INTO meets (name, date, location)
VALUES (?, ?, ?)
RETURNING *;

-- name: UpdateMeet :one
UPDATE meets
SET name = ?, date = ?, location = ?
WHERE id = ?
RETURNING *;

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;

-- name: GetAllResults :many
SELECT * FROM results ORDER BY id;

-- name: GetResultByID :one
SELECT * FROM results WHERE id = ? LIMIT 1;

-- name: GetResultsByAthlete :many
SELECT r.*, m.name as meet_name, m.date as meet_date
FROM results r
JOIN meets m ON r.meet_id = m.id
WHERE r.athlete_id = ?
ORDER BY m.date;

-- name: GetResultsByMeet :many
SELECT r.*, a.name as athlete_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: CreateResult :one
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?)
RETURNING *;

-- name: UpdateResult :one
UPDATE results
SET athlete_id = ?, meet_id = ?, time = ?, place = ?
WHERE id = ?
RETURNING *;

-- name: DeleteResult :exec
DELETE FROM results WHERE id = ?;
