# =============================== VARIABLES =============================== #

NAME        := ft_transcendance

COMPOSE     := docker compose
REMOVE		:= rm -rf

RESET       := \e[0m
RED         := \e[1;31m
BLUE        := \e[1;36m
GREEN       := \e[1;32m
YELLOW      := \e[1;33m

BUILD_DEPS	:=	backend/Dockerfile			\
				frontend/Dockerfile			\
				frontend/package.json		\
				backend/requirements.txt

MAKEFLAGS   += --no-print-directory

# =============================== COMMANDES =============================== #

all: up

build: $(BUILD_DEPS)
	@echo "$(BLUE)🎐 • Building $(NAME)...$(RESET)"
	@$(COMPOSE) build
	@echo "$(BLUE)-> Build completed! ⛲️$(RESET)"

up:
	@echo "$(GREEN)🎍 • Starting $(NAME)...$(RESET)"
	@$(COMPOSE) up -d
	@echo "$(GREEN)-> Application is up and running! 🐉$(RESET)"

down:
	@echo "$(YELLOW)🚧 • Stopping $(NAME)...$(RESET)"
	@$(COMPOSE) down

logs:
	@$(COMPOSE) logs -f

status:
	@$(COMPOSE) ps

re: down up

clean:
	@echo "$(YELLOW)🔥 • Cleaning containers and local volumes...$(RESET)"
	@$(COMPOSE) down -v --rmi local

fclean:
	@printf "⚠️ Êtes-vous sûr de vouloir tout supprimer (conteneurs, volumes, images) ? [y/N] "; \
	read choice; \
	if [ "$$choice" = "y" ] || [ "$$choice" = "Y" ]; then \
		docker compose down -v --rmi local --remove-orphans; \
		printf "\033[1;31m-> Full cleanup completed 🧨\033[0m\n"; \
	else \
		printf "\033[1;31m-> Operation aborted 🐦‍🔥\033[0m\n"; \
	fi

env:
	@if [ -f .env ]; then \
		sed 's/=.*/=/' .env > .env.example; \
		echo "✅ Fichier .env.example généré/mis à jour avec succès !"; \
	else \
		echo "❌ Erreur : Aucun fichier .env trouvé à la racine."; \
		exit 1; \
	fi

.PHONY: all build up down logs status re clean fclean env
