# Makefile

# Имена ваших Compose‑файлов
COMPOSE_INFRA   := docker-compose-infr.yaml
COMPOSE_SERVICES:= docker-compose-services.yaml

# Объединённый вызов Docker Compose
DC := docker compose -f $(COMPOSE_INFRA) -f $(COMPOSE_SERVICES)

.PHONY: up build down restart logs ps

## Собрать образы для всех сервисов
build:
	$(DC) build

## Запустить всю инфраструктуру и сервисы в фоне
up:
	$(DC) up -d --build

stop:
	$(DC) stop

## Остановить и удалить контейнеры, сети и т. д.
down:
	$(DC) down

## Перезапустить (stop → build → up)
restart: stop build up

## Показать статус контейнеров
ps:
	$(DC) ps

## Смотреть логи всех сервисов в реальном времени
logs:
	$(DC) logs -f