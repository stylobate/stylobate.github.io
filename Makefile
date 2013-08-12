build:
	./node_modules/stylus/bin/stylus style.styl && \
	./node_modules/stylus/bin/stylus style.ie.styl && \
	./node_modules/autoprefixer/bin/autoprefixer style.css

.PHONY: build
