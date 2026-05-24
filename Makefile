.PHONY: dev install migrate seed ingest

dev:
	npm run dev

install:
	npm install

migrate:
	npm run migrate --workspace=server

seed:
	npm run seed --workspace=server

ingest:
	npm run ingest --workspace=server
