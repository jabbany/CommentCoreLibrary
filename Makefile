SRC_CORE = CommentFilter.js CommentSpaceAllocator.js CommentCoreLibrary.js
SRC_TRANSITION = CCLComment.js CommentFilter.js CommentTransitionSpaceAllocator.js CommentTransitionLibrary.js
ACSRC = parsers/AcfunFormat.js
BILISRC = parsers/BilibiliFormat.js

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
	cp base.css build/base.css

clean: 
	rm build/CommentCore.js
