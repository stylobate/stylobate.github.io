build:
	./node_modules/stylus/bin/stylus s/style.styl && \
	./node_modules/stylus/bin/stylus s/style.ie.styl && \
	./node_modules/autoprefixer/bin/autoprefixer s/style.css

up:
	npm install && \
	git submodule init && \
	git submodule update && \
	cd s/stylobate && \
	git checkout master && \
	git pull --rebase && \
	npm install && \
	cd ../..
	cd s/stylobate-wireframe && \
	git checkout master && \
	git pull --rebase && \
	cd ../..

.PHONY: build
