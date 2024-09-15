.PHONY: stack/start
stack/start:
	docker-compose up -d

.PHONY: stack/stop
stack/stop:
	docker-compose down
