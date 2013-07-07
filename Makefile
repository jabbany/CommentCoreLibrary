SRC = CCLComment.js CommentFilter.js CommentSpaceAllocator.js CommentCoreLibrary.js
ACSRC = parsers/AcfunFormat.js
BILISRC = parsers/BilibiliFormat.js

all: core parsers
core: $(SRC)
	cat $^ > build/CommentCore.js

parsers: parserbili parserac
	cat build/AParser.js build/BParser.js > build/Parsers.js
	rm build/AParser.js
	rm build/BParser.js

parserbili:
	cat $(BILISRC) > build/BParser.js
parserac:
	cat $(ACSRC) > build/AParser.js
clean: 
	rm build/CommentCore.js
