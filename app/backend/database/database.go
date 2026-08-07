package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"backend/models"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB(dbPath, env string) *sql.DB {
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Printf("⚠️ Alerta ao criar diretório do banco (%s): %v", dir, err)
	}

	dsn := fmt.Sprintf("%s?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)", dbPath)

	var err error
	DB, err = sql.Open("sqlite", dsn)
	if err != nil {
		log.Fatalf("❌ Erro ao abrir banco de dados SQLite (%s): %v", dbPath, err)
	}

	DB.SetMaxOpenConns(1)

	if err := DB.Ping(); err != nil {
		log.Fatalf("❌ Falha de ping no banco de dados SQLite (%s): %v", dbPath, err)
	}

	createTableSQL := `
	CREATE TABLE IF NOT EXISTS items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		status TEXT NOT NULL,
		environment TEXT NOT NULL,
		created_at TEXT NOT NULL
	);`

	if _, err := DB.Exec(createTableSQL); err != nil {
		log.Fatalf("❌ Erro ao criar tabela no SQLite: %v", err)
	}

	var count int
	err = DB.QueryRow("SELECT COUNT(*) FROM items").Scan(&count)
	if err == nil && count == 0 {
		log.Printf("🌱 Banco SQLite limpo detectado em [%s]. Populando dados iniciais...", env)
		seedInitialData(env)
	}

	log.Printf("✅ Conexão com SQLite iniciada [Arquivo ABSOLUTO: %s] (Ambiente: %s)", dbPath, env)
	return DB
}

func seedInitialData(env string) {
	var initialItems []models.Item

	switch strings.ToLower(env) {
	case "homologacao", "hml", "staging":
		initialItems = []models.Item{
			{Title: "[HML] Homologar funcionalidade de CRUD no SQLite", Status: "Em Teste", Environment: env},
			{Title: "[HML] Validar isolamento do banco SQLite de HML", Status: "Aprovado", Environment: env},
			{Title: "[HML] Testar carga e gravação persistente", Status: "Pendente", Environment: env},
		}
	case "producao", "prod":
		initialItems = []models.Item{
			{Title: "[PROD] Monitorar métricas de disponibilidade", Status: "Ativo", Environment: env},
			{Title: "[PROD] Executar rotina de backup diário do SQLite", Status: "Concluído", Environment: env},
		}
	default:
		initialItems = []models.Item{
			{Title: "[DEV] Configurar ambiente local e rotas", Status: "Concluído", Environment: "desenvolvimento"},
			{Title: "[DEV] Testar integração com Tailwind CSS e Lucide Icons", Status: "Em Progresso", Environment: "desenvolvimento"},
			{Title: "[DEV] Validar gravação persistente em arquivo SQLite", Status: "Ativo", Environment: "desenvolvimento"},
		}
	}

	stmt, err := DB.Prepare("INSERT INTO items (title, status, environment, created_at) VALUES (?, ?, ?, ?)")
	if err != nil {
		log.Printf("⚠️ Erro ao preparar inserção inicial: %v", err)
		return
	}
	defer stmt.Close()

	nowStr := time.Now().Format(time.RFC3339)
	for _, item := range initialItems {
		_, err := stmt.Exec(item.Title, item.Status, item.Environment, nowStr)
		if err != nil {
			log.Printf("⚠️ Erro ao gravar item de semente: %v", err)
		}
	}
}

func CountItems() int {
	var count int
	if DB != nil {
		_ = DB.QueryRow("SELECT COUNT(*) FROM items").Scan(&count)
	}
	return count
}
