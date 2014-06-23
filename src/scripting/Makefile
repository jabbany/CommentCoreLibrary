all: clean compile

clean:
	rm -rf build
	mkdir build	
	
definitions:
	tsc -d --target ES5 src/api/Runtime/Runtime.ts --out src/api/Runtime.d.ts
	tsc -d --target ES5 src/api/Player/Player.ts --out src/api/Player.d.ts
	
compile:
	tsc --target ES5 src/api/Display/Display.ts --out build/api/Display.js
	tsc --target ES5 src/api/Runtime/Runtime.ts --out build/api/Runtime.js
	tsc --target ES5 src/api/Player/Player.ts --out build/api/Player.js
	tsc --target ES5 src/api/Utils/Utils.ts --out build/api/Utils.js
	cp src/*.js build/
	cp src/api/*.js build/api/
	cp src/api/Tween/Tween.js build/api/
