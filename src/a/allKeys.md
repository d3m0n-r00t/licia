## CN

获取对象的所有键名，包括自身的及继承的。

|参数名|说明|
|-----|---|
|obj|目标对象|
|options|选项|
|返回值|包含所有键名的数组|

可用选项：

|参数名|说明|
|-----|---|
|prototype=true|包含原型键名|
|unenumerable=false|包含不可枚举键名|
|symbol=false|包含 Symbol 键名|

Object 对象原型上的方法不会被获取到。 

