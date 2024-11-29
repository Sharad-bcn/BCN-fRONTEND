start:
	@cat envs/.env.local > .env
	@npm start

.PHONY: build
build-dev:
	@cat envs/.env.dev > .env
	@npm run build
	@cp assets/robot/disallow-robots.txt build/robots.txt
	@npm info ./ version > build/version.txt

build-prod:
	@cat envs/.env.prod > .env
	@npm run build
	@cp assets/robot/allow-robots.txt build/robots.txt
	@npm info ./ version > build/version.txt

sync-dev: build-dev
	@rsync --verbose --recursive --compress --checksum --progress --delete -e "ssh -i /keys/bcn.pem" ./build/ ubuntu@65.1.94.168:/var/www/dev.bcnindia.com/

sync-prod: build-prod
	@rsync --verbose --recursive --compress --checksum --progress --delete -e "ssh -i /keys/bcn.pem" ./build/ ubuntu@65.1.94.168:/var/www/www.bcnindia.com/ 
