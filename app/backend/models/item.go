package models

import "time"

type Item struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Status      string    `json:"status"`
	Environment string    `json:"environment"`
	CreatedAt   time.Time `json:"created_at"`
}

type SystemInfo struct {
	App         string `json:"app"`
	Version     string `json:"version"`
	Environment string `json:"environment"`
	Port        string `json:"port"`
	DbPath      string `json:"db_path"`
	TotalItems  int    `json:"total_items"`
}

type HealthResponse struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	DbStatus    string `json:"db_status"`
}
