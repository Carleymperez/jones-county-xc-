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
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Grade          int    `json:"grade"`
	PersonalRecord string `json:"personal_record"`
}

func GetAthletes(c *gin.Context) {
	athletes := []Athlete{
		{ID: 1, Name: "Alex Johnson", Grade: 11, PersonalRecord: "16:45"},
		{ID: 2, Name: "Sam Williams", Grade: 10, PersonalRecord: "17:02"},
	}
	c.JSON(200, athletes)
}

func HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":    "healthy",
		"message":   "Backend server is running!",
		"timestamp": time.Now(),
	})
}

func initDB() *sql.DB {
	db, err := sql.Open("sqlite", "data.db")
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Enable WAL mode for better concurrent read performance
	if _, err := db.Exec("PRAGMA journal_mode=WAL"); err != nil {
		log.Fatalf("Failed to set journal mode: %v", err)
	}

	// Create schema
	schema := `
	CREATE TABLE IF NOT EXISTS athletes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		grade INTEGER,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err := db.Exec(schema); err != nil {
		log.Fatalf("Failed to create schema: %v", err)
	}

	log.Println("Database initialized successfully")
	return db
}

func main() {
	db := initDB()
	defer db.Close()

	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/health", HealthCheck)

	api := r.Group("/api")
	{
		api.GET("/health", HealthCheck)
		api.GET("/athletes", GetAthletes)
	}

	log.Println("Server starting on port :8080")
	r.Run(":8080")
}
