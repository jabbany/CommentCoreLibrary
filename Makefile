SRC_CORE = src/CommentFilter.js src/CommentSpaceAllocator.js src/CommentCoreLibrary.js
SRC_TRANSITION = src/CCLComment.js src/CommentFilter.js src/CommentTransitionSpaceAllocator.js src/CommentTransitionLibrary.js
ACSRC = parsers/AcfunFormat.js
BILISRC = parsers/BilibiliFormat.js
DIR = src/

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
	cat $(BILISRC) > build/BParser.js
parserac:
	cat $(ACSRC) > build/AParser.js

css:
	cp  src/base.css build/base.css

clean: 
	rm build/CommentCore.js
