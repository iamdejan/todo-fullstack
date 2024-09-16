.PHONY: stack/database
stack/database:
	docker-compose -f docker-compose-database.yaml up -d
