.PHONY: stack/start
stack/start:
	docker compose up -d

.PHONY: stack/watch
stack/watch:
	docker compose up --watch

.PHONY: stack/stop
stack/stop:
	docker-compose down

.PHONY: stack/database
stack/database:
	docker-compose -f docker-compose-database.yaml up -d
