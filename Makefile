# Makefile is only used for local development.
# In production, it's advisable to use Docker Stack.

.PHONY: frontend/start
frontend/start:
	cd frontend && pnpm run dev

.PHONY: backend/start
backend/start:
	cd backend && fastapi dev main.py
