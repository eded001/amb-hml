package config

import (
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	Env    string
	Port   string
	DbPath string
}

func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists && strings.TrimSpace(value) != "" {
		return value
	}
	return fallback
}

func LoadConfig() Config {
	env := GetEnv("ENV", "desenvolvimento")
	port := GetEnv("PORT", "8080")
	rawDbPath := GetEnv("DB_PATH", "")

	if rawDbPath == "" {
		switch strings.ToLower(env) {
		case "homologacao", "hml", "staging":
			rawDbPath = "./hml/infra/database.db"
		case "producao", "prod":
			rawDbPath = "./prod/infra/database.db"
		default:
			rawDbPath = "./app/infra/database.db"
		}
	}

	absDbPath, err := filepath.Abs(rawDbPath)
	if err != nil {
		absDbPath = rawDbPath
	}

	return Config{
		Env:    env,
		Port:   port,
		DbPath: absDbPath,
	}
}
