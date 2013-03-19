JSC:=cat

all: js/framework.js js/index.js js/json2.js post/post.js view/view.js
clean:
	-rm js/framework.js js/index.js js/json2.js post/post.js view/view.js
js/framework.js: COMPILE/js/framework.js
	$(JSC) -o js/framework.js COMPILE/js/framework.js 
js/index.js: COMPILE/js/index.js
	$(JSC) -o js/index.js COMPILE/js/index.js
js/json2.js: COMPILE/js/json2.js
	$(JSC) -o js/json2.js COMPILE/js/json2.js
post/post.js: COMPILE/post/post.js
	$(JSC) -o post/post.js COMPILE/post/post.js
view/view.js: COMPILE/view/view.js
	$(JSC) -o view/view.js COMPILE/view/view.js
.PHONY: all clean
