JSC:=cat

all: js/framework.js js/index.js js/json2.js
clean:
	-rm js/framework.js js/index.js js/json2.js
js/framework.js: COMPILE/js/framework.js
	$(JSC) -o js/framework.js COMPILE/js/framework.js 
js/index.js: COMPILE/js/index.js
	$(JSC) -o js/index.js COMPILE/js/index.js
js/json2.js: COMPILE/js/json2.js
	$(JSC) -o js/json2.js COMPILE/js/json2.js
.PHONY: all clean
