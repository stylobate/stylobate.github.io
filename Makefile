build:
	./node_modules/stylus/bin/stylus s/style.styl && \
	./node_modules/stylus/bin/stylus s/style.ie.styl && \
	./node_modules/autoprefixer/bin/autoprefixer s/style.css

.PHONY: build
