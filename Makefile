all: up

up:
	docker compose up --build

down:
	docker compose down

re:	down up

clean:
	docker compose down -v --rmi local

fclean:
	docker compose down --rmi local --remove-orphans
	docker builder prune -f

.PHONY: all up down re clean
