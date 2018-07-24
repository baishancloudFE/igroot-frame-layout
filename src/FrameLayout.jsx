import React from 'react'
import { Layout, Menu, Icon, Popconfirm, Button, Row, Col, Popover, Input, Avatar } from 'igroot'
import { Router, Link } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import PropTypes from 'prop-types'
import { getLocalStorage, toggleFullScreen, setLocalStorage } from './function'
import './frameLayout.scss'

const { SubMenu, Item } = Menu
const { Header, Content, Sider, Footer } = Layout

export default class FrameLayout extends React.Component {
  constructor(props) {
    super(props)

    this.hashHistory = this.getHistory()

    this.state = {
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
      displaySearchApp: false,
      inputSearchValue: ''
    }
  }

  getHistory = () => {
    const { myHistory } = this.props
    return myHistory || createHashHistory()
  }

  // 获取菜单数据
  getMenu = () => {
    const { menus } = this.props
    let res = menus || getLocalStorage('menu')
    if (!this.checkMenuFormat(res)) {
      res = this.transferMenus(res)
    }
    return res
  }

  // 获取导航所需的平台链接数据
  getAppLinks = (value = "") => {
    const { apps } = this.props
    const appObj = apps || getLocalStorage('apps')

    let res = []
    if (appObj) {
      const allApps = ((apps || getLocalStorage('apps')).authed) || []
      res = allApps.filter(item => item.cname.indexOf(value) >= 0)
    }
    return res
  }

  // 获取用户名数据
  getUserName = () => {
    const { userName } = this.props
    const res = userName || getLocalStorage('cname')

    return res
  }

  // 获得去除参数信息后的菜单对象（例如：/a/b/:id）
  getRouteWithNoNumber = () => {
    const { location: { hash } } = window

    const routeItems = hash.split('/')
    const newRouteItems = routeItems.filter(item => isNaN(item) && item !== '#')

    let route = '/' + newRouteItems.join('/')

    return route
  }

  componentWillMount() {
    this.log('componentWillMount')
    const menus = this.getMenu()

    this.log('menus', menus)

    this.historyListen(menus)

    const initialRoute = getLocalStorage('currentRoute')
    if (initialRoute) {
      this.hashHistory.push(initialRoute)
      localStorage.removeItem('currentRoute')
    }

    // 初始得到的路由信息
    let route = this.getRouteWithNoNumber()

    this.log('初始route', route)


    let selectedMenu, openKey
    // 默认路径如果为／，则设置第一个叶子菜单为默认路由
    if (!route || route === '/') {
      const firstChildMenu = this.getFlatMenus(menus[0])[0]
      this.log('初始route为空，找到的menu是', firstChildMenu)
      openKey = menus[0].key
      selectedMenu = firstChildMenu
    } else {// 用户手动输入一个路由
      let menu = this.searchMenuByPath(menus, route)
      this.log('初始route不为空，找到的menu是', menu)
      if (!!menu) {
        const parentMenu = this.searchParentMenu(menu, menus)
        selectedMenu = menu
        openKey = parentMenu ? parentMenu.key : selectedKey
      }// 如果不存在说明用户输入的路径有误，或者没有权限，则进入平台自定义的404路由
    }

    // 如果页面初始化时的浏览器路径可以找到
    if (selectedMenu) {
      if (selectedMenu.to !== route) {
        this.hashHistory.push(selectedMenu.to)
      }

      document.title = this.props.appName + '-' + selectedMenu.name
      this.setState({
        openKeys: [openKey],
        selectedKeys: [selectedMenu.key]
      })
    }
  }

  render() {
    const { selectedKeys, collapsed, openKeys } = this.state
    const { mode, myHistory } = this.props

    this.log('openKeys', openKeys, 'selectedKeys', selectedKeys)

    const siderHeaderContainer = (
      <Layout style={{ height: '100%' }} id='frame-container-page'>

        <Sider
          id="sider"
          trigger={null}
          collapsible
          collapsed={collapsed}>
          {this.renderLogo()}
          <Menu
            theme='dark'
            mode='inline'
            openKeys={openKeys}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ width: '100%' }}
          >
            {this.renderMenu()}
          </Menu>
        </Sider>

        <Layout>

          <Header className='header'>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.onCollapse}
            />
            <span style={{
              display: 'inline-block',
              float: 'right',
              height: '100%',
              cursor: 'pointer',
              marginRight: 15,
              fontSize: 16
            }}>
              {this.renderAppLink()}
              {this.renderContactors()}
              {this.renderFullScreen()}
              {this.renderLogout()}
            </span>
          </Header>

          <Content style={{ margin: '12px 12px 0', height: '100%' }}>
            {this.props.children}
          </Content>

          {this.renderFooter()}

        </Layout>
      </Layout>
    )
    const siderContainer = (
      <Layout style={{ height: '100%' }} id='frame-container-page'>
        <Sider
          id="sider"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}>
          {this.renderLogo()}
          <div className="sider-user-area">
            <span className="sider-user-name">
              {this.renderLogout()}
              {this.renderAppLink()}
            </span>
          </div>
          <Menu
            theme='dark'
            mode='inline'
            openKeys={openKeys}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ width: '100%' }}
          >
            {this.renderMenu()}
          </Menu>
        </Sider>

        <Layout>
          <Content style={{ margin: '12px 12px 0', height: '100%' }}>
            {this.props.children}
          </Content>
          {this.renderFooter()}
        </Layout>

      </Layout>
    )
    const headerContainer = (
      <Layout style={{ height: '100%' }} id='header-page'>
        <Header>
          {this.renderLogo()}
          <Menu
            theme='dark'
            mode='horizontal'
            style={{ display: 'inline-block' }}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
          >
            {this.renderMenu()}
          </Menu>
          <span style={{
            display: 'inline-block',
            float: 'right',
            height: '100%',
            cursor: 'pointer',
            fontSize: 16,
            color: '#fff'
          }}>
            {this.renderAppLink()}
            {this.renderLogout()}
          </span>
        </Header>
        <Content style={{ margin: '12px 12px 0', height: '100%' }}>
          {this.props.children}
        </Content>
        {this.renderFooter()}
      </Layout >
    )
    return (
      myHistory ?
        (
          mode === 'sider+header' ? siderHeaderContainer
            : (mode === 'sider' ? siderContainer : headerContainer)
        ) :
        (
          <Router history={this.hashHistory}>
            {
              mode === 'sider+header' ? siderHeaderContainer
                : (mode === 'sider' ? siderContainer : headerContainer)
            }
          </Router >
        )
    )
  }

  // 处理父级菜单展开
  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys: [openKeys[openKeys.length - 1]]
    })
  }

  // 监听浏览器地址栏变化，并联动菜单的选中状态
  historyListen = (menus) => {
    this.hashHistory.listen((location) => {
      this.log('hashHistory.listen', location.pathname)
      if (location.pathname !== '/') {
        let currentMenu = this.searchMenuByPath(menus, location.pathname)
        this.log('currentMenu', currentMenu)
        if (!!currentMenu) {
          let parentMenu = this.searchParentMenu(currentMenu, menus)
          this.log('parentMenu', parentMenu)
          document.title = this.props.appName + '-' + currentMenu.name
          this.log(!!currentMenu && !!parentMenu && currentMenu.key !== this.state.selectedKeys[0])
          if (!!parentMenu && currentMenu.key !== this.state.selectedKeys[0]) {

            this.setState({
              selectedKeys: [currentMenu.key],
              openKeys: [parentMenu.key]
            })
          }
        }
      }

    })
  }

  // 渲染菜单
  renderMenu = () => {
    const menus = this.getMenu()
    return menus.map(item => {
      if (!item.subs)
        return (
          <Item key={item.key}>
            <Link to={item.to}>
              {
                item.iconType ? <Icon type={item.iconType} /> : null
              }
              <span>{item.name}</span>
            </Link>
          </Item>
        )
      else
        return (
          <SubMenu
            key={item.key}
            title={<span><Icon type={item.iconType} /><span>{item.name}</span></span>}
          >
            {
              item.subs.map(sub => (
                <Item key={sub.key}>
                  <Link to={sub.to}>
                    {
                      sub.iconType ? <Icon type={sub.iconType} /> : null
                    }
                    <span>{sub.name}</span>
                  </Link>
                </Item>
              ))
            }
          </SubMenu>
        )
    })
  }

  // 显示搜索平台的搜索框
  showSearch = () => {
    this.setState({ displaySearchApp: true })
  }

  // 设置平台的过滤值
  searchApps = (e) => {
    this.setState({ inputSearchValue: e.target.value })
  }

  handleInputConfirm = () => {
    this.setState({
      displaySearchApp: false,
    });
  }

  renderFullScreen = () => {
    const { needFullScreen } = this.props
    return (
      needFullScreen ? <Button icon="arrows-alt" style={{ marginRight: 32 }} onClick={toggleFullScreen}>全屏</Button> : null
    )
  }
  // 渲染 平台导航 部分
  renderAppLink = () => {
    const { mode } = this.props

    const apps = this.getAppLinks(inputSearchValue)

    if (apps.length === 0)
      return null

    const { displaySearchApp, inputSearchValue } = this.state
    const title = (
      <div>
        平台导航
        <span style={{ marginLeft: 8 }}>
          {
            displaySearchApp ?
              <Input.Search
                size="small"
                placeholder="我要去..."
                defaultValue={inputSearchValue}
                style={{ width: 200 }}
                onChange={this.searchApps}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
              : <Icon type="search" onClick={this.showSearch} />
          }
        </span>
      </div>
    )

    const content = (
      apps.length > 0 ?
        (
          <Row>
            {
              apps.map((app, index) => (
                <Col span={6} key={app.cname + index} style={{ padding: 6 }}>
                  <a target="_blank" rel="noopener noreferrer" href={app.appUrl}>{app.cname}</a>
                </Col>
              ))
            }
          </Row>
        ) : null
    )

    let placement
    let handleArea = <Button style={{ marginRight: 12 }} icon="link">平台导航</Button>
    switch (mode) {
      case 'sider+header':
        placement = "bottomLeft"
        break
      case 'header':
        placement = "bottomLeft"
        handleArea = <Icon type="link" style={{ marginLeft: 12, fontSize: 14 }} />
        break
      case 'sider':
        placement = "rightTop"
        handleArea = <Icon type="link" style={{ marginLeft: 22, fontSize: 14 }} />
        break
      default:
        placement = "bottomLeft"
        break
    }

    return (
      <Popover
        placement={placement}
        title={title}
        content={content}
        trigger="hover"
        autoAdjustOverflow
        overlayStyle={{ width: 700 }}>
        {handleArea}
      </Popover>
    )
  }

  // 渲染页脚
  renderFooter = () => {
    const { needFooter } = this.props
    const year = (new Date()).getFullYear()
    return (
      needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © {year} 白山云科技</Footer> : null
    )
  }

  // 渲染 登出 部分
  renderLogout = () => {
    const { apiDomain, mode } = this.props

    return (
      <span>
        {
          mode === 'sider' ? (
            <Popconfirm title='确定注销当前账号吗?' onConfirm={() => this.props.onLogout(apiDomain)} placement="bottomRight">
              <Avatar className="sider-avatar" shape="square" icon="user" style={{ marginRight: 12 }} />
            </Popconfirm>
          ) : null
        }

        <span style={{ marginRight: 12 }}>{this.getUserName() || '未登录'}</span>

        <Popconfirm title='确定注销当前账号吗?' onConfirm={() => this.props.onLogout(apiDomain)} placement="bottom">
          <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
        </Popconfirm>
      </span>

    )
  }

  // 渲染 联系人 部分
  renderContactors = () => {
    const { contactors } = this.props
    return (
      contactors ?
        <Popconfirm
          title={
            <div>
              <p>以下是开发人员的联系方式</p>
              {
                contactors.map(item => (
                  <div style={{ marginTop: 12 }} key={item.name}>
                    <Icon type="user" style={{ marginRight: 6 }} />{item.name}
                    <div style={{ paddingLeft: 12 }}>
                      <Icon type="phone" style={{ marginRight: 6 }} />{item.phone}
                    </div>
                    <a style={{ paddingLeft: 12 }} onClick={() => { window.open(`tencent://message/?uin=${2923218206}&Site=JooIT.com&Menu=yes`) }}>
                      qq   {item.qq}
                    </a>
                  </div>
                ))
              }
            </div>
          }
          okText="朕已阅">
          <Button icon="phone" style={{ marginRight: 12 }} >联系我们</Button>
        </Popconfirm> : null
    )
  }

  // 渲染 Logo 布局
  renderLogo = () => {
    const { logo, appName } = this.props
    return (
      logo ? (
        <div className="logo">
          <img src={logo} alt="logo" />
          <h1>{appName}</h1>
        </div>
      ) : (
          <div className="logo-only-name">
            <div className="app-name">{appName}</div>
          </div>
        )
    )
  }

  // TODO：收缩后点击别的父级菜单下的菜单，展开后还是原来的，要更新！！！
  onCollapse = () => {
    const collapsed = !this.state.collapsed

    let curOpenKey      // 收缩后的 openKey 应该是空的
    let storageOpenKey  // 保存收缩前的 openKey
    if (collapsed) {
      curOpenKey = ""
      storageOpenKey = this.state.openKeys[0]
    } else {
      curOpenKey = getLocalStorage('openKey')
      storageOpenKey = ""
    }
    setLocalStorage('openKey', storageOpenKey)
    this.setState({
      collapsed,
      openKeys: [curOpenKey]
    })
  }

  // 将所有菜单平铺
  getFlatMenus = (menu) => {
    let res = []
    if (!!menu.subs && menu.subs.length > 0) {
      menu.subs.forEach(sub => {
        res = [...res, ...this.getFlatMenus(sub)]
      })
    } else {
      res.push(menu)
    }
    return res
  }

  // 获取某个菜单的最上级菜单
  searchParentMenu = (menu, menus) => {
    let res = []
    menus.forEach(item => {
      const childMenus = this.getFlatMenus(item)
      if (childMenus.some(child => child.to === menu.to)) {
        res.push(item)
      }
    })
    return res[0]
  }

  // 根据 路径名过滤出菜单
  searchMenuByPath = (allMenus, pathname) => {
    let res
    allMenus.forEach(menu => {
      if (menu.to === pathname) {
        res = menu
      } else if (!res && menu.subs && menu.subs.length > 0) {
        const childRes = this.searchMenuByPath(menu.subs, pathname)
        if (childRes) {
          res = childRes
        }
      }
    })
    return res
  }

  // 循环遍历菜单，在每个菜单路径前面加上‘／’
  transferMenus = (allMenus) => {
    return allMenus.map(menu => {
      menu.to = '/' + menu.to
      menu.key = menu.to

      if (menu.subs && menu.subs.length > 0) {
        const childRes = this.transferMenus(menu.subs)
        if (childRes) {
          menu.subs = childRes
        }
      }
      return menu
    })
  }

  // 检测菜单的格式：是否都以 '/' 开头
  checkMenuFormat = (menus) => {
    const flatMenus = this.getFlatMenus(menus)[0]
    const isValidType = flatMenus.every(item => `${item.to}`.slice(0, 1) === '/')
    return isValidType
  }

  // 打印调试日志的开关（只有在LocalStorage中把 displayLog 设置为 true 才可以查看日志）
  log = (...content) => {
    const displayLog = getLocalStorage('displayLog')
    if (displayLog) {
      console.log(...content)
    }
  }
}

FrameLayout.propTypes = {
  apiDomain: PropTypes.string.isRequired,           // 接口请求地址,用于登出操作
  logo: PropTypes.string,                           // logo路径
  appName: PropTypes.string.isRequired,             // 平台名称
  mode: PropTypes.string,                           // 三种可选的菜单模式：sider+header;sider;header
  needFooter: PropTypes.bool,                       // 是否需要页脚
  needFullScreen: PropTypes.bool,                   // 是否需要全屏按钮
  menus: PropTypes.array,                           // 自定义菜单数据
  apps: PropTypes.object,                           // 自定义菜单数据
  userName: PropTypes.string,                       // 自定义用户名数据
  contactors: PropTypes.array,                      // 自定义联系人数据
  onLogout: PropTypes.func,                         // 处理登出逻辑
  myHistory: PropTypes.object,                      // 自定义 history 对象
}
FrameLayout.defaultProps = {
  mode: 'sider+header',
  needFooter: true,
  needFullScreen: true,
  onLogout: function (domain) {
    window.localStorage.clear()
    window.location.assign(domain + '/account/user/logout');
  },
}
