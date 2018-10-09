# igroot-frame-layout 组件
> iGroot 项目的布局组件

## 使用

下载 npm 包
```jsx
npm i --save igroot-frame-layout
```

在 bsy.json 中登记
```jsx
{
  "options": {
    "esModule": [
      "igroot-frame-layout"
    ]
  }
}
```

在代码中使用
```jsx
import FrameLayout from 'igroot-frame-layout'

export class App extends React.Component {
  render(){
    return (
      <FrameLayout
        apiDomain='http://xxx.xx.xx.xx'
        logo="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
        appName="测试平台">
        <YourComponent/>
      </FrameLayout>
    )
  }
}

```

## 开放属性

| 参数        | 是否必填   | 说明    |  类型  |  默认值
| --------   | ----------:| -----:   | :----: |  :----: |
| apiDomain   | 必填     | 接口请求地址      |   string    | -
| logo    | 非必填|   logo路径    |   string    | -
| appName    | 必填|   平台名称    |   string    | -
| mode    | 非必填|   三种可选的菜单模式：sider+header;sider;header    |   string    | "sider+header"
| needFooter    | 非必填|   是否需要页脚    |   boolean    | true
| needFullScreen    | 非必填|   是否需要全屏按钮    |   boolean    | true
| menus    | 非必填|   自定义菜单数据    |  array   | -
| apps    | 非必填|   自定义平台数据    |  object   | -
| userName | 非必填| 自定义用户名数据      |   string    | -
| contactors | 非必填   |   自定义联系人数据    |   array    | -
| onLogout | 非必填   |   自定义登出逻辑    |   function    | 见下方
| myHistory | 非必填   |   自定义 history 对象    |   object    | -

```jsx
// onLogout 的示例
function (domain) {
    const clearItems = ['jwtToken', 'currentRoute', 'currentUrl', 'menu', 'apps', 'cname', 'apis', 'resources', 'name', 'JWT_TOKEN', 'MENU_INFO']
    clearItems.forEach(item => {
      window.localStorage.removeItem(item)
    })
    window.location.assign(domain + '/account/user/logout');
  }
```

## 更新日志
#### 0.0.1
> 2018.07.04
> - 🌟 初始化菜单布局组件

#### 0.0.13
> 2018.07.05
> - 💄 平台导航样式优化

#### 0.0.14
> 2018.07.05
> - 🐞 修复路由带:id类型参数的路径匹配不到菜单的bug

#### 0.0.15
> 2018.07.05
> - 🌟 第一个稳定版本

#### 0.0.16
> 2018.07.09
> - 🐞 修复sider模式下用户信息部分样式错乱的bug

#### 0.0.18
> 2018.07.09
> - 💄 浏览器title前加上平台名

#### 0.1.0
> 2018.07.11
> - 💄 加入routerFree和myHistory两个参数，支持用户自己管理Router和history

#### 0.1.5
> 2018.07.11
> - 💄 去除routerFree配置项，直接由是否传入myHistory来判断用户是否需要自己管理Router和history，简化配置

#### 0.1.13
> 2018.08.03
> - 💄 给右侧layout加上ID，便于 BackTop 组件定位作用范围
> - 💄 为所有可操作的图标加上移过鼠标变为小手的样式

#### 0.1.14
> 2018.08.10
> - 🐞 修复一个未定义变量的bug

#### 0.1.15
> 2018.09.26
> - 🐞 igroot 修复菜单模式为 horizontal 时下拉菜单无法点击的bug，随之升级

#### 0.1.16
> 2018.10.08
> - 🐞 将最外层 Layout 的样式由 “height: 100%” 改为 “min-height: 100%”
