package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"backend/config"
	"backend/database"
	"backend/models"
)

func HealthHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dbStatus := "connected"
		if database.DB == nil || database.DB.Ping() != nil {
			dbStatus = "disconnected"
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(models.HealthResponse{
			Status:      "ok",
			Environment: cfg.Env,
			DbStatus:    dbStatus,
		})
	}
}

func InfoHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		totalItems := database.CountItems()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(models.SystemInfo{
			App:         "Amb-HML Sistema (SQLite + Tailwind)",
			Version:     "3.0.0 (Modularizado)",
			Environment: cfg.Env,
			Port:        cfg.Port,
			DbPath:      cfg.DbPath,
			TotalItems:  totalItems,
		})
	}
}

func ItemsHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		switch r.Method {
		case http.MethodGet:
			rows, err := database.DB.Query("SELECT id, title, status, environment, created_at FROM items ORDER BY id DESC")
			if err != nil {
				log.Printf("❌ Erro em SELECT /api/items: %v", err)
				http.Error(w, fmt.Sprintf(`{"error": "Erro ao consultar SQLite: %v"}`, err), http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			items := make([]models.Item, 0)
			for rows.Next() {
				var item models.Item
				var createdAtStr string
				if err := rows.Scan(&item.ID, &item.Title, &item.Status, &item.Environment, &createdAtStr); err != nil {
					log.Printf("⚠️ Erro ao ler linha do SQLite: %v", err)
					continue
				}
				t, err := time.Parse(time.RFC3339, createdAtStr)
				if err != nil {
					t, _ = time.Parse("2006-01-02 15:04:05", createdAtStr)
				}
				item.CreatedAt = t
				items = append(items, item)
			}
			json.NewEncoder(w).Encode(items)

		case http.MethodPost:
			var req struct {
				Title  string `json:"title"`
				Status string `json:"status"`
			}
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Title) == "" {
				http.Error(w, `{"error": "Título do item é obrigatório"}`, http.StatusBadRequest)
				return
			}

			if req.Status == "" {
				req.Status = "Pendente"
			}

			nowStr := time.Now().Format(time.RFC3339)
			res, err := database.DB.Exec("INSERT INTO items (title, status, environment, created_at) VALUES (?, ?, ?, ?)",
				req.Title, req.Status, cfg.Env, nowStr)
			if err != nil {
				log.Printf("❌ Erro em INSERT /api/items: %v", err)
				http.Error(w, fmt.Sprintf(`{"error": "Erro ao inserir no SQLite: %v"}`, err), http.StatusInternalServerError)
				return
			}

			id, _ := res.LastInsertId()
			log.Printf("✨ Novo registro gravado no SQLite [ID: %d, Título: %s, ENV: %s]", id, req.Title, cfg.Env)

			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(models.Item{
				ID:          id,
				Title:       req.Title,
				Status:      req.Status,
				Environment: cfg.Env,
				CreatedAt:   time.Now(),
			})

		case http.MethodDelete:
			idStr := r.URL.Query().Get("id")
			if idStr == "" {
				http.Error(w, `{"error": "ID não informado"}`, http.StatusBadRequest)
				return
			}
			id, err := strconv.ParseInt(idStr, 10, 64)
			if err != nil {
				http.Error(w, `{"error": "ID inválido"}`, http.StatusBadRequest)
				return
			}

			res, err := database.DB.Exec("DELETE FROM items WHERE id = ?", id)
			if err != nil {
				log.Printf("❌ Erro em DELETE /api/items: %v", err)
				http.Error(w, fmt.Sprintf(`{"error": "Erro ao deletar no SQLite: %v"}`, err), http.StatusInternalServerError)
				return
			}

			rowsAffected, _ := res.RowsAffected()
			log.Printf("🗑️ Registro removido do SQLite [ID: %d, Linhas afetadas: %d]", id, rowsAffected)

			json.NewEncoder(w).Encode(map[string]interface{}{"message": "Item removido com sucesso", "id": id, "rows_affected": rowsAffected})

		default:
			http.Error(w, `{"error": "Método não suportado"}`, http.StatusMethodNotAllowed)
		}
	}
}
