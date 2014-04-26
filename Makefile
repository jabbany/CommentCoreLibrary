BUILD_MINIFY = build/Parsers.js build/CommentCore.js
SRC_CORE = src/CommentFilter.js src/CommentSpaceAllocator.js src/CommentCoreLibrary.js
SRC_TRANSITION = src/CCLComment.js src/CommentFilter.js src/CommentTransitionSpaceAllocator.js src/CommentTransitionLibrary.js
ACSRC ?= parsers/AcfunFormat.js
BILISRC ?= parsers/BilibiliFormat.js
DIR = src/

all-uglify: all uglify

all: core parsers css

core: $(SRC_CORE)
	cat $^ > build/CommentCore.js

core-transition: $(SRC_TRANSITION)
	cat $^ > build/CommentCoreT.js

parsers: parserbili parserac
	cat build/AParser.js build/BParser.js > build/Parsers.js
	rm build/AParser.js
	rm build/BParser.js

parserbili:
ifneq ($(BILISRC),)
	cat $(BILISRC) > build/BParser.js
endif

parserac:
ifneq ($(ACSRC),)
	cat $(ACSRC) > build/AParser.js
endif

extensions-scripting:
	cp experimental/bscript.js build/CCLScripting.js
	cp experimental/api.worker.js build/api.worker.js

css:
	cp  src/base.css build/base.css

uglify: $(BUILD_MINIFY)
	./node_modules/.bin/uglifyjs $^ -c -m -o build/CommentCoreLibrary.tmp --preamble "/* CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */"
	rm build/*.js
	mv build/CommentCoreLibrary.tmp build/CommentCoreLibrary.js

clean: 
	rm build/CommentCore.js
