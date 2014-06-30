BUILD_MINIFY = build/Parsers.js build/CommentCore.js
SRC_CORE = src/CommentFilter.js src/CommentSpaceAllocator.js src/CommentCoreLibrary.js
SRC_TRANSITION = src/CCLComment.js src/CommentFilter.js src/CommentTransitionSpaceAllocator.js src/CommentTransitionLibrary.js
ACSRC ?= parsers/AcfunFormat.js
BILISRC ?= parsers/BilibiliFormat.js
DIR = src/

all-uglify: all uglify

all-concat-only: all concat-only

all: clean core parsers css

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
	cat $(DIR)$(BILISRC) > build/BParser.js
endif

parserac:
ifneq ($(ACSRC),)
	cat $(DIR)$(ACSRC) > build/AParser.js
endif

css:
	cp src/base.css build/base.css
	cp src/fontalias.css build/fontalias.css
	cat build/base.css build/fontalias.css > build/style.css
	rm -f build/base.css
	rm -f build/fontalias.css

concat-only: $(BUILD_MINIFY)
	cat $^ > build/CommentCoreLibrary.tmp
	rm build/*.js
	mv build/CommentCoreLibrary.tmp build/CommentCoreLibrary.js
	
uglify: $(BUILD_MINIFY)
	node ./node_modules/uglify-js/bin/uglifyjs $^ -c -m -o build/CommentCoreLibrary.tmp --preamble "/* CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */"
	rm build/*.js
	mv build/CommentCoreLibrary.tmp build/CommentCoreLibrary.js

extensions: extensions-scripting

extensions-scripting:
	cp experimental/bscript.js build/CCLScripting.js
	cp experimental/api.worker.js build/api.worker.js

clean: 
	rm -rf build/
	mkdir build
