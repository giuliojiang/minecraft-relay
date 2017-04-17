all: client
	cd relay-side && make
	cd server-side && make

client:
	python script/initialize_config.py
