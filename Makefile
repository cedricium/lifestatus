.PHONY: clean start stop update logs shell

all: update start

clean:
	docker compose rm -vf

build:
	docker compose up -d --build

start: build clean

stop:
	docker compose down

update: stop
	git pull

logs:
	docker compose logs lifestatus-app-1 -f

shell:
	docker exec -it lifestatus-app-1 sh
