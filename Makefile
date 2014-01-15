build:
	./node_modules/stylus/bin/stylus s/style.styl && \
	./node_modules/stylus/bin/stylus s/style.ie.styl

watch:
	./node_modules/stylus/bin/stylus --watch s/style.styl

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

serve:
	jekyll serve --port 4001 --watch --config _config.yml,_config-dev.yml

.PHONY: build
