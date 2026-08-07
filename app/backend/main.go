package main

import (
	"fmt"
	"log"
	"net/http"

	"backend/config"
	"backend/database"
	"backend/handlers"
	"backend/middleware"
)

func main() {
	// Carregar configurações de ambiente
	cfg := config.LoadConfig()

	// Inicializar conexão SQLite e infraestrutura
	db := database.InitDB(cfg.DbPath, cfg.Env)
	defer db.Close()

	// Registrar handlers com middlewares
	http.HandleFunc("/health", middleware.EnableCORS(handlers.HealthHandler(cfg)))
	http.HandleFunc("/api/info", middleware.EnableCORS(handlers.InfoHandler(cfg)))
	http.HandleFunc("/api/items", middleware.EnableCORS(handlers.ItemsHandler(cfg)))

	fmt.Printf("🚀 Servidor Backend iniciado [%s] na porta %s (SQLite ativo)\n", cfg.Env, cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, nil))
}
