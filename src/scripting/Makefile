all: clean compile

clean:
	rm -rf build
	mkdir build	
	
compile:
	tsc --target ES5 src/api/Display/Display.ts --out build/api/Display.js
	cp src/*.js build/
	cp src/api/*.js build/api/
	cp src/api/Player/Player.js build/api/
	cp src/api/Tween/Tween.js build/api/
	cp src/api/Runtime/Runtime.js build/api/
