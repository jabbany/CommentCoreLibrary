all: clean compile

clean:
	rm -rf build
	mkdir build	
	
definitions:
	tsc -d --target ES5 src/api/Runtime/Runtime.ts --out src/api/Runtime.d.ts
	tsc -d --target ES5 src/api/Player/Player.ts --out src/api/Player.d.ts
	tsc -d --target ES5 src/api/Tween/Tween.ts --out src/api/Tween.d.ts

compile: compile-ts compile-host
	
compile-host:
	cp src/*.js build/
	cp src/api/*.js build/api/
	cat build/Host.js build/Unpacker.js > build/_Host.js
	rm -f build/Unpacker.js
	rm -f build/Host.js
	mv build/_Host.js build/Host.js
	
compile-ts:
	tsc --target ES5 src/api/Display/Display.ts --out build/api/Display.js
	tsc --target ES5 src/api/Runtime/Runtime.ts --out build/api/Runtime.js
	tsc --target ES5 src/api/Player/Player.ts --out build/api/Player.js
	tsc --target ES5 src/api/Utils/Utils.ts --out build/api/Utils.js
	tsc --target ES5 src/api/Tween/Tween.ts --out build/api/Tween.js
