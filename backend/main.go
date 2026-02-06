package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

type Athlete struct {
	ID             int     `json:"id"`
	Name           string  `json:"name"`
	Grade          *int    `json:"grade"`
	PersonalRecord *string `json:"personal_record"`
	Events         *string `json:"events"`
}

type Meet struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Date     *string `json:"date"`
	Location *string `json:"location"`
}

type Result struct {
	ID        int     `json:"id"`
	AthleteID *int    `json:"athleteId"`
	MeetID    *int    `json:"meetId"`
	Time      *string `json:"time"`
	Place     *int    `json:"place"`
}

var db *sql.DB

func GetAthletes(c *gin.Context) {
	rows, err := db.Query("SELECT id, name, grade, personal_record, events FROM athletes")
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var athletes []Athlete
	for rows.Next() {
		var a Athlete
		if err := rows.Scan(&a.ID, &a.Name, &a.Grade, &a.PersonalRecord, &a.Events); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		athletes = append(athletes, a)
	}
	c.JSON(200, athletes)
}

func GetMeets(c *gin.Context) {
	rows, err := db.Query("SELECT id, name, date, location FROM meets")
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var meets []Meet
	for rows.Next() {
		var m Meet
		if err := rows.Scan(&m.ID, &m.Name, &m.Date, &m.Location); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		meets = append(meets, m)
	}
	c.JSON(200, meets)
}

func GetResults(c *gin.Context) {
	rows, err := db.Query("SELECT id, athlete_id, meet_id, time, place FROM results")
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var results []Result
	for rows.Next() {
		var r Result
		if err := rows.Scan(&r.ID, &r.AthleteID, &r.MeetID, &r.Time, &r.Place); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		results = append(results, r)
	}
	c.JSON(200, results)
}

func HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":    "healthy",
		"message":   "Backend server is running!",
		"timestamp": time.Now(),
	})
}

func initDB() {
	var err error
	db, err = sql.Open("sqlite", "data.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Enable WAL mode for better concurrent read performance
	if _, err := db.Exec("PRAGMA journal_mode=WAL"); err != nil {
		log.Fatalf("Failed to set journal mode: %v", err)
	}

	// Enable foreign keys
	if _, err := db.Exec("PRAGMA foreign_keys=ON"); err != nil {
		log.Fatalf("Failed to enable foreign keys: %v", err)
	}

	log.Println("Database initialized successfully")
}

func main() {
	initDB()
	defer db.Close()

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/health", HealthCheck)

	api := r.Group("/api")
	{
		api.GET("/health", HealthCheck)
		api.GET("/athletes", GetAthletes)
		api.GET("/meets", GetMeets)
		api.GET("/results", GetResults)
	}

	log.Println("Server starting on port :8080")
	r.Run(":8080")
}
