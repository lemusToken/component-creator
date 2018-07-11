# DOM

**注意**

* 开发时需要在项目中引入'babel-polyfill'
* 生产环境中需要使用babel编译后的版本，需要在调用前引入es6.dll.js

1. 组件的基本架构（mixin混合）

    组件由增删改查四个插件构成，各个插件之间高度解耦，只在使用时通过mixin内聚为
    DOM类输出（DOM类同时继承增删改查四类，拥有所有父级的公共方法）

1. 扩展插件的一般结构

    ```js
    //  dom/libs/something.js
    class Something {
      //   自定义方法
      someMethod (args, selector = this._context) {

      }

      //   获取上下文
      context () {
        return this._context
      }
    }

    export default Something

    //  修改dom/libs/index.js，添加Something
    ```

1. 查找

    ```js
    import {DOM} from './dom'

    //默认查询body
    DOM()
    //DOM('css选择器')
    //获取id=a的元素
    DOM('#a')
    //find查找首个符合选择器的集
    DOM('#a').find('.b')
    //findAll查找所有集
    DOM('#a').findAll('.b')
    //连续查找
    DOM('#a').find('.b').findAll('.c')
    //查找相邻子集
    DOM('#a').find('.b').child()
    //查找所有子集
    DOM('#a').find('.b').children()
    //查找相邻父集
    DOM('#a').find('.b').parent()
    //查找所有父集
    DOM('#a').find('.b').parentAll()
    //查找兄弟集合
    DOM('#a').find('.b').siblings()
    //过滤
    DOM('#a').findAll('.a').filter('.b')
    //通过content获取dom对象，所有context返回的都是数组
    DOM('#a').context()
    ```

1. 添加

    ```js
    //添加在最后
    DOM('#a').find('.b').append('<a></a>')
    //添加在最前
    DOM('#a').prepend('<a></a>')
    //在元素后添加
    DOM('#a').after('<a></a>')
    //在元素前添加
    DOM('#a').before('<a></a>')
    ```

1. 替换

    ```js
    DOM('#a').find('.b').replaceWith('<a></a>')
    ```

1. 删除

    ```js
    DOM('#a').find('.b').empty()
    DOM('#a').find('.b').remove()
    ```

1. 联合

    ```js
    DOM('#a').find('.b').child().remove()
    ```

1. 文档碎片

   ```js
   let node = DOM('<div></div>').append('<a>something</a>')
   DOM().append(node)
   ```