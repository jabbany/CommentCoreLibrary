all: clean compile

clean:
	rm -rf build
	mkdir build	
	
compile:
	tsc --target ES5 src/api/Display/Display.ts --out build/api/Display.js
	tsc --target ES5 src/api/Runtime/Runtime.ts --out build/api/Runtime.js
	tsc --target ES5 src/api/Player/Player.ts --out build/api/Player.js
	cp src/*.js build/
	cp src/api/*.js build/api/
	cp src/api/Tween/Tween.js build/api/
