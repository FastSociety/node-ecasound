#!/usr/bin/make -f

all:
	npm install --production
	
install:
	mkdir -p $(DESTDIR)/usr/lib/node_modules/ecasound
	cp -a lib test package.json $(DESTDIR)/usr/lib/node_modules/ecasound