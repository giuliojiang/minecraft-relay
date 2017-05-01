all: client
	cd relay-side && make
	cd server-side && make

client:
	python script/initialize_config.py

test: all
	cd relay-side && make test
	cd server-side && make test

force:
	cd relay-side && make force
	cd server-side && make force
