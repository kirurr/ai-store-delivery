.PHONY: dev dev-build prod-up prod-down

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --watch 

dev-build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache


prod-build:
	docker compose -f docker-compose.yml build

prod-up:
	docker compose -f docker-compose.yml up -d

prod-down:
	docker compose -f docker-compose.yml down
