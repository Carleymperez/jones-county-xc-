package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
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

// --- Auth ---

const adminUsername = "admin"
const adminPlainPassword = "greyhounds2025"

var (
	adminHash []byte
	tokens    = make(map[string]bool)
	tokensMu  sync.RWMutex
)

func initAuth() {
	hash, err := bcrypt.GenerateFromPassword([]byte(adminPlainPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash admin password: %v", err)
	}
	adminHash = hash
	log.Println("Auth initialized")
}

func Login(c *gin.Context) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"message": "invalid request"})
		return
	}

	if input.Username != adminUsername {
		c.JSON(401, gin.H{"message": "Invalid username or password"})
		return
	}
	if err := bcrypt.CompareHashAndPassword(adminHash, []byte(input.Password)); err != nil {
		c.JSON(401, gin.H{"message": "Invalid username or password"})
		return
	}

	token := uuid.NewString()
	tokensMu.Lock()
	tokens[token] = true
	tokensMu.Unlock()

	c.JSON(200, gin.H{"token": token})
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": "unauthorized"})
			return
		}
		token := strings.TrimPrefix(header, "Bearer ")
		tokensMu.RLock()
		valid := tokens[token]
		tokensMu.RUnlock()
		if !valid {
			c.AbortWithStatusJSON(401, gin.H{"message": "unauthorized"})
			return
		}
		c.Next()
	}
}

// --- Read handlers ---

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

// --- Athlete write handlers ---

func CreateAthlete(c *gin.Context) {
	var input struct {
		Name           string  `json:"name"`
		Grade          *int64  `json:"grade"`
		PersonalRecord *string `json:"personal_record"`
		Events         *string `json:"events"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if input.Name == "" {
		c.JSON(400, gin.H{"error": "name is required"})
		return
	}

	athlete, err := queries.CreateAthlete(context.Background(), db.CreateAthleteParams{
		Name:           input.Name,
		Grade:          ptrToNullInt64(input.Grade),
		PersonalRecord: ptrToNullString(input.PersonalRecord),
		Events:         ptrToNullString(input.Events),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, AthleteResponse{
		ID:             athlete.ID,
		Name:           athlete.Name,
		Grade:          nullInt64ToPtr(athlete.Grade),
		PersonalRecord: nullStringToPtr(athlete.PersonalRecord),
		Events:         nullStringToPtr(athlete.Events),
	})
}

func UpdateAthlete(c *gin.Context) {
	id := c.Param("id")
	var athleteID int64
	if _, err := fmt.Sscanf(id, "%d", &athleteID); err != nil {
		c.JSON(400, gin.H{"error": "invalid athlete ID"})
		return
	}

	var input struct {
		Name           string  `json:"name"`
		Grade          *int64  `json:"grade"`
		PersonalRecord *string `json:"personal_record"`
		Events         *string `json:"events"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	athlete, err := queries.UpdateAthlete(context.Background(), db.UpdateAthleteParams{
		ID:             athleteID,
		Name:           input.Name,
		Grade:          ptrToNullInt64(input.Grade),
		PersonalRecord: ptrToNullString(input.PersonalRecord),
		Events:         ptrToNullString(input.Events),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, AthleteResponse{
		ID:             athlete.ID,
		Name:           athlete.Name,
		Grade:          nullInt64ToPtr(athlete.Grade),
		PersonalRecord: nullStringToPtr(athlete.PersonalRecord),
		Events:         nullStringToPtr(athlete.Events),
	})
}

func DeleteAthlete(c *gin.Context) {
	id := c.Param("id")
	var athleteID int64
	if _, err := fmt.Sscanf(id, "%d", &athleteID); err != nil {
		c.JSON(400, gin.H{"error": "invalid athlete ID"})
		return
	}

	if err := queries.DeleteAthlete(context.Background(), athleteID); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "athlete deleted"})
}

// --- Meet write handlers ---

func CreateMeet(c *gin.Context) {
	var input struct {
		Name     string  `json:"name"`
		Date     *string `json:"date"`
		Location *string `json:"location"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if input.Name == "" {
		c.JSON(400, gin.H{"error": "name is required"})
		return
	}

	meet, err := queries.CreateMeet(context.Background(), db.CreateMeetParams{
		Name:     input.Name,
		Date:     ptrToNullString(input.Date),
		Location: ptrToNullString(input.Location),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, MeetResponse{
		ID:       meet.ID,
		Name:     meet.Name,
		Date:     nullStringToPtr(meet.Date),
		Location: nullStringToPtr(meet.Location),
	})
}

func UpdateMeet(c *gin.Context) {
	id := c.Param("id")
	var meetID int64
	if _, err := fmt.Sscanf(id, "%d", &meetID); err != nil {
		c.JSON(400, gin.H{"error": "invalid meet ID"})
		return
	}

	var input struct {
		Name     string  `json:"name"`
		Date     *string `json:"date"`
		Location *string `json:"location"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	meet, err := queries.UpdateMeet(context.Background(), db.UpdateMeetParams{
		ID:       meetID,
		Name:     input.Name,
		Date:     ptrToNullString(input.Date),
		Location: ptrToNullString(input.Location),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, MeetResponse{
		ID:       meet.ID,
		Name:     meet.Name,
		Date:     nullStringToPtr(meet.Date),
		Location: nullStringToPtr(meet.Location),
	})
}

func DeleteMeet(c *gin.Context) {
	id := c.Param("id")
	var meetID int64
	if _, err := fmt.Sscanf(id, "%d", &meetID); err != nil {
		c.JSON(400, gin.H{"error": "invalid meet ID"})
		return
	}

	if err := queries.DeleteMeet(context.Background(), meetID); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "meet deleted"})
}

// --- Result write handlers ---

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

	c.JSON(201, ResultResponse{
		ID:        result.ID,
		AthleteID: nullInt64ToPtr(result.AthleteID),
		MeetID:    nullInt64ToPtr(result.MeetID),
		Time:      nullStringToPtr(result.Time),
		Place:     nullInt64ToPtr(result.Place),
	})
}

func UpdateResult(c *gin.Context) {
	id := c.Param("id")
	var resultID int64
	if _, err := fmt.Sscanf(id, "%d", &resultID); err != nil {
		c.JSON(400, gin.H{"error": "invalid result ID"})
		return
	}

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

	result, err := queries.UpdateResult(context.Background(), db.UpdateResultParams{
		ID:        resultID,
		AthleteID: sql.NullInt64{Int64: input.AthleteID, Valid: true},
		MeetID:    sql.NullInt64{Int64: input.MeetID, Valid: true},
		Time:      sql.NullString{String: input.Time, Valid: true},
		Place:     sql.NullInt64{Int64: input.Place, Valid: true},
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, ResultResponse{
		ID:        result.ID,
		AthleteID: nullInt64ToPtr(result.AthleteID),
		MeetID:    nullInt64ToPtr(result.MeetID),
		Time:      nullStringToPtr(result.Time),
		Place:     nullInt64ToPtr(result.Place),
	})
}

func DeleteResult(c *gin.Context) {
	id := c.Param("id")
	var resultID int64
	if _, err := fmt.Sscanf(id, "%d", &resultID); err != nil {
		c.JSON(400, gin.H{"error": "invalid result ID"})
		return
	}

	if err := queries.DeleteResult(context.Background(), resultID); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "result deleted"})
}

// --- Misc ---

func HealthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":    "healthy",
		"message":   "Backend server is running!",
		"timestamp": time.Now(),
	})
}

// --- Helper functions ---

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

func ptrToNullString(s *string) sql.NullString {
	if s != nil {
		return sql.NullString{String: *s, Valid: true}
	}
	return sql.NullString{}
}

func ptrToNullInt64(i *int64) sql.NullInt64 {
	if i != nil {
		return sql.NullInt64{Int64: *i, Valid: true}
	}
	return sql.NullInt64{}
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

	initAuth()

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/health", HealthCheck)

	api := r.Group("/api")
	{
		api.GET("/health", HealthCheck)

		// Auth
		api.POST("/auth/login", Login)

		// Public read endpoints
		api.GET("/athletes", GetAthletes)
		api.GET("/athletes/:id", GetAthleteByID)
		api.GET("/meets", GetMeets)
		api.GET("/meets/:id", GetMeetByID)
		api.GET("/meets/:id/results", GetMeetResults)
		api.GET("/results", GetResults)

		// Protected write endpoints
		admin := api.Group("/", AuthMiddleware())
		{
			admin.POST("/athletes", CreateAthlete)
			admin.PUT("/athletes/:id", UpdateAthlete)
			admin.DELETE("/athletes/:id", DeleteAthlete)

			admin.POST("/meets", CreateMeet)
			admin.PUT("/meets/:id", UpdateMeet)
			admin.DELETE("/meets/:id", DeleteMeet)

			admin.POST("/results", CreateResult)
			admin.PUT("/results/:id", UpdateResult)
			admin.DELETE("/results/:id", DeleteResult)
		}
	}

	log.Println("Server starting on port :8080")
	r.Run(":8080")
}
