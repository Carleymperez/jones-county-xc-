package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	response := HealthResponse{
		Status:    "healthy",
		Message:   "Backend server is running!",
		Timestamp: time.Now(),
	}

	json.NewEncoder(w).Encode(response)
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	response := map[string]interface{}{
		"message": "API endpoint is working",
		"method":  r.Method,
		"path":    r.URL.Path,
	}

	json.NewEncoder(w).Encode(response)
}

func main() {
	r := mux.NewRouter()

	// Health endpoint
	r.HandleFunc("/health", healthHandler).Methods("GET", "OPTIONS")

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/health", healthHandler).Methods("GET", "OPTIONS")
	api.HandleFunc("/", apiHandler).Methods("GET", "POST", "PUT", "DELETE", "OPTIONS")

	// Start server
	port := ":8080"
	log.Printf("Server starting on port %s", port)
	log.Printf("Health check: http://localhost%s/health", port)
	log.Fatal(http.ListenAndServe(port, r))
}
