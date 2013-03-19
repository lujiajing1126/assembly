JSC:=cat

all: js/framework.js js/index.js js/json2.js post/post.js view/view.js
clean:
	-rm js/framework.js js/index.js js/json2.js post/post.js view/view.js
js/framework.js: COMPILE/js/framework.js
	$(JSC) COMPILE/js/framework.js > js/framework.js
js/index.js: COMPILE/js/index.js
	$(JSC) COMPILE/js/index.js > js/index.js
js/json2.js: COMPILE/js/json2.js
	$(JSC) COMPILE/js/json2.js > js/json2.js
post/post.js: COMPILE/post/post.js
	$(JSC) COMPILE/post/post.js > post/post.js
view/view.js: COMPILE/view/view.js
	$(JSC) COMPILE/view/view.js > view/view.js
.PHONY: all clean
