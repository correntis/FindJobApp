COMPOSE_INFRA   := docker-compose-infr.yaml
COMPOSE_SERVICES:= docker-compose-services.yaml

DC := docker compose -f $(COMPOSE_INFRA) -f $(COMPOSE_SERVICES)

.PHONY: up build down restart logs ps

build:
	$(DC) build

up:
	$(DC) up -d --build

stop:
	$(DC) stop

down:
	$(DC) down

restart: stop build up

ps:
	$(DC) ps

logs:
	$(DC) logs -f