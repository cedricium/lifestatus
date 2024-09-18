.PHONY: clean start stop update logs shell

all: update start

clean:
	docker system prune 2> /dev/null || sudo !!

build:
	docker compose up -d --build 2> /dev/null || sudo !!

start: build clean

stop:
	docker compose down 2> /dev/null || sudo !!

update: stop
	git pull

logs:
	docker compose logs lifestatus-app-1 -f 2> /dev/null || sudo !!

shell:
	docker exec -it lifestatus-app-1 sh 2> /dev/null || sudo !!
