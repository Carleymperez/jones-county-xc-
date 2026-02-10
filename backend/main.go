package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"

	"jones-county-xc/backend/db"
)

// JSON-friendly response types
type AthleteResponse struct {
	ID             int64   `json:"id"`
	Name           string  `json:"name"`
	Grade          *int64  `json:"grade"`
	PersonalRecord *string `json:"personal_record"`
	Events         *string `json:"events"`
}

type MeetResponse struct {
	ID       int64   `json:"id"`
	Name     string  `json:"name"`
	Date     *string `json:"date"`
	Location *string `json:"location"`
}

type ResultResponse struct {
	ID        int64   `json:"id"`
	AthleteID *int64  `json:"athleteId"`
	MeetID    *int64  `json:"meetId"`
	Time      *string `json:"time"`
	Place     *int64  `json:"place"`
}

type MeetResultResponse struct {
	ID          int64   `json:"id"`
	AthleteID   *int64  `json:"athleteId"`
	MeetID      *int64  `json:"meetId"`
	Time        *string `json:"time"`
	Place       *int64  `json:"place"`
	AthleteName string  `json:"athleteName"`
}

var queries *db.Queries
var database *sql.DB

func GetAthletes(c *gin.Context) {
	athletes, err := queries.GetAllAthletes(context.Background())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := make([]AthleteResponse, len(athletes))
	for i, a := range athletes {
		response[i] = AthleteResponse{
			ID:             a.ID,
			Name:           a.Name,
			Grade:          nullInt64ToPtr(a.Grade),
			PersonalRecord: nullStringToPtr(a.PersonalRecord),
			Events:         nullStringToPtr(a.Events),
		}
	}
	c.JSON(200, response)
}

func GetAthleteByID(c *gin.Context) {
	id := c.Param("id")
	var athleteID int64
	if _, err := fmt.Sscanf(id, "%d", &athleteID); err != nil {
		c.JSON(400, gin.H{"error": "invalid athlete ID"})
		return
	}

	athlete, err := queries.GetAthleteByID(context.Background(), athleteID)
	if err != nil {
		c.JSON(404, gin.H{"error": "athlete not found"})
		return
	}

	response := AthleteResponse{
		ID:             athlete.ID,
		Name:           athlete.Name,
		Grade:          nullInt64ToPtr(athlete.Grade),
		PersonalRecord: nullStringToPtr(athlete.PersonalRecord),
		Events:         nullStringToPtr(athlete.Events),
	}
	c.JSON(200, response)
}

func GetMeets(c *gin.Context) {
	meets, err := queries.GetAllMeets(context.Background())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := make([]MeetResponse, len(meets))
	for i, m := range meets {
		response[i] = MeetResponse{
			ID:       m.ID,
			Name:     m.Name,
			Date:     nullStringToPtr(m.Date),
			Location: nullStringToPtr(m.Location),
		}
	}
	c.JSON(200, response)
}

func GetMeetByID(c *gin.Context) {
	id := c.Param("id")
	var meetID int64
	if _, err := fmt.Sscanf(id, "%d", &meetID); err != nil {
		c.JSON(400, gin.H{"error": "invalid meet ID"})
		return
	}

	meet, err := queries.GetMeetByID(context.Background(), meetID)
	if err != nil {
		c.JSON(404, gin.H{"error": "meet not found"})
		return
	}

	response := MeetResponse{
		ID:       meet.ID,
		Name:     meet.Name,
		Date:     nullStringToPtr(meet.Date),
		Location: nullStringToPtr(meet.Location),
	}
	c.JSON(200, response)
}

func GetResults(c *gin.Context) {
	results, err := queries.GetAllResults(context.Background())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := make([]ResultResponse, len(results))
	for i, r := range results {
		response[i] = ResultResponse{
			ID:        r.ID,
			AthleteID: nullInt64ToPtr(r.AthleteID),
			MeetID:    nullInt64ToPtr(r.MeetID),
			Time:      nullStringToPtr(r.Time),
			Place:     nullInt64ToPtr(r.Place),
		}
	}
	c.JSON(200, response)
}

func GetMeetResults(c *gin.Context) {
	id := c.Param("id")
	var meetID int64
	if _, err := fmt.Sscanf(id, "%d", &meetID); err != nil {
		c.JSON(400, gin.H{"error": "invalid meet ID"})
		return
	}

	results, err := queries.GetResultsByMeet(context.Background(), sql.NullInt64{Int64: meetID, Valid: true})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := make([]MeetResultResponse, len(results))
	for i, r := range results {
		response[i] = MeetResultResponse{
			ID:          r.ID,
			AthleteID:   nullInt64ToPtr(r.AthleteID),
			MeetID:      nullInt64ToPtr(r.MeetID),
			Time:        nullStringToPtr(r.Time),
			Place:       nullInt64ToPtr(r.Place),
			AthleteName: r.AthleteName,
		}
	}
	c.JSON(200, response)
}

func CreateResult(c *gin.Context) {
	var input struct {
		AthleteID int64  `json:"athleteId"`
		MeetID    int64  `json:"meetId"`
		Time      string `json:"time"`
		Place     int64  `json:"place"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	result, err := queries.CreateResult(context.Background(), db.CreateResultParams{
		AthleteID: sql.NullInt64{Int64: input.AthleteID, Valid: true},
		MeetID:    sql.NullInt64{Int64: input.MeetID, Valid: true},
		Time:      sql.NullString{String: input.Time, Valid: true},
		Place:     sql.NullInt64{Int64: input.Place, Valid: true},
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := ResultResponse{
		ID:        result.ID,
		AthleteID: nullInt64ToPtr(result.AthleteID),
		MeetID:    nullInt64ToPtr(result.MeetID),
		Time:      nullStringToPtr(result.Time),
		Place:     nullInt64ToPtr(result.Place),
	}
	c.JSON(201, response)
}

func HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":    "healthy",
		"message":   "Backend server is running!",
		"timestamp": time.Now(),
	})
}

// Helper functions to convert sql.Null types to pointers
func nullStringToPtr(ns sql.NullString) *string {
	if ns.Valid {
		return &ns.String
	}
	return nil
}

func nullInt64ToPtr(ni sql.NullInt64) *int64 {
	if ni.Valid {
		return &ni.Int64
	}
	return nil
}

func initDB() {
	var err error
	database, err = sql.Open("sqlite", "data.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	if _, err := database.Exec("PRAGMA journal_mode=WAL"); err != nil {
		log.Fatalf("Failed to set journal mode: %v", err)
	}

	if _, err := database.Exec("PRAGMA foreign_keys=ON"); err != nil {
		log.Fatalf("Failed to enable foreign keys: %v", err)
	}

	queries = db.New(database)
	log.Println("Database initialized successfully")
}

func main() {
	initDB()
	defer database.Close()

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/health", HealthCheck)

	api := r.Group("/api")
	{
		api.GET("/health", HealthCheck)
		api.GET("/athletes", GetAthletes)
		api.GET("/athletes/:id", GetAthleteByID)
		api.GET("/meets", GetMeets)
		api.GET("/meets/:id", GetMeetByID)
		api.GET("/meets/:id/results", GetMeetResults)
		api.GET("/results", GetResults)
		api.POST("/results", CreateResult)
	}

	log.Println("Server starting on port :8080")
	r.Run(":8080")
}
