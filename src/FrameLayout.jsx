import React from 'react'
import { Layout, Menu, Icon, Popconfirm, Dropdown, Button, Avatar } from 'igroot'
import { Router, Link } from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import PropTypes from 'prop-types'
import { getLocalStorage, toggleFullScreen, setLocalStorage } from './function'
import './frameLayout.scss'

const { SubMenu, Item } = Menu
const { Header, Content, Sider, Footer } = Layout
const hashHistory = createHashHistory()

// const contactors = [
//   {
//     name: '王远洋',
//     phone: '18150163382',
//     qq: '383881952'
//   },
//   {
//     name: '范溢贞',
//     phone: '18106987196',
//     qq: '614235948'
//   }
// ]

export default class FrameLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
    }
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
  getAppLinks = () => {
    const { apps } = this.props
    const res = apps || getLocalStorage('apps')
    return res.authed
  }

  // 获取用户名数据
  getUserName = () => {
    const { userName } = this.props
    const res = userName || getLocalStorage('cname')

    return res
  }

  componentWillMount() {
    this.log('componentWillMount')
    const menus = this.getMenu()
    this.historyListen(menus)

    const initialRoute = getLocalStorage('currentRoute')
    if (initialRoute) {
      hashHistory.push(initialRoute)
      localStorage.removeItem('currentRoute')
    }

    let route   // 初始得到的路由信息
    const { location: { hash } } = window
    route = hash.replace('#', "")

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

    // window.location.hash = selectedMenu.to
    if (selectedMenu.to !== route) {
      hashHistory.push(selectedMenu.to)
    }

    document.title = selectedMenu.name
    this.setState({
      openKeys: [openKey],
      selectedKeys: [selectedMenu.key]
    })


  }

  render() {
    const { selectedKeys, collapsed, openKeys } = this.state
    const { apiDomain, logo, appName, mode, needFooter, contactors } = this.props
    const menus = this.getMenu()
    this.log('openKeys', openKeys, 'selectedKeys', selectedKeys)

    const applinks =
      (
        <Menu style={{ maxHeight: 400, overflow: 'auto' }}>
          {
            this.getAppLinks().map(app => (
              <Menu.Item key={app.cname}>
                <a target="_blank" rel="noopener noreferrer" href={app.appUrl}>{app.cname}</a>
              </Menu.Item>
            ))
          }
        </Menu>
      );

    const siderHeaderContainer = (
      <Layout style={{ height: '100%' }} id='container-page'>
        <Sider
          id="sider"
          trigger={null}
          collapsible
          collapsed={collapsed}>
          {
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
          }
          <Menu
            theme='dark'
            mode='inline'
            openKeys={openKeys}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ width: '100%' }}
          >
            {
              this.renderMenu(menus)
            }
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

              <Dropdown overlay={applinks}>
                <Button style={{ marginRight: 12 }} >
                  友情链接 <Icon type="down" />
                </Button>
              </Dropdown>

              {
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
                                {/* <img style={{ width: 12, height: 12, marginRight: 6 }} src='./static/qq.png' />{item.qq} */}
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
              }


              <Button icon="arrows-alt" style={{ marginRight: 32 }} onClick={toggleFullScreen}>全屏</Button>
              <span style={{ marginRight: 12 }}>{this.getUserName() || '未登录'}</span>
              <Popconfirm title='确定注销当前账号吗?' onConfirm={() => this.props.onLogout(apiDomain)}>
                <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
              </Popconfirm>
            </span>
          </Header>
          <Content style={{ margin: '12px 12px 0', height: '100%' }}>
            {this.props.children}
          </Content>
          {
            needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © 2018 白山云科技</Footer> : null
          }
        </Layout>
      </Layout>
    )
    const siderContainer = (
      <Layout style={{ height: '100%' }} id='container-page'>
        <Sider
          id="sider"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}>
          {
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
          }
          <div className="sider-user-area">
            <Popconfirm title='确定注销当前账号吗?' onConfirm={() => this.props.onLogout(apiDomain)}>
              <Avatar className="sider-avatar" shape="square" icon="user" style={{ marginRight: 12 }} />
            </Popconfirm>
            <span className="sider-user-name">
              <span style={{ marginRight: 12, fontSize: 14 }}>{this.getUserName() || '未登录'}</span>
              <Popconfirm title='确定注销当前账号吗?' onConfirm={() => this.props.onLogout(apiDomain)}>
                <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
              </Popconfirm>

              <Dropdown overlay={applinks}>
                <Icon type="link" style={{ marginLeft: 22, fontSize: 14 }} />
              </Dropdown>
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
            {
              this.renderMenu(menus)
            }
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '12px 12px 0', height: '100%' }}>
            {this.props.children}
          </Content>
          {
            needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © 2018 白山云科技</Footer> : null
          }
        </Layout>
      </Layout>
    )
    const headerContainer = (
      <Layout style={{ height: '100%' }} id='header-page'>
        <Header>
          {
            logo ? (
              <span className="logo">
                <img src={logo} alt="logo" />
                <h1>{appName}</h1>
              </span>
            ) : (
                <span className="logo-only-name">
                  <span className="app-name">{appName}</span>
                </span>
              )
          }
          <Menu
            theme='dark'
            mode='horizontal'
            style={{ display: 'inline-block' }}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
          >
            {
              this.renderMenu(menus)
            }
          </Menu>
          <span style={{
            display: 'inline-block',
            float: 'right',
            height: '100%',
            cursor: 'pointer',
            fontSize: 16,
            color: '#fff'
          }}>
            <Dropdown overlay={applinks}>
              <Icon type="link" style={{ marginRight: 0 }} />
            </Dropdown>

            <span style={{ marginRight: 12 }}>{this.getUserName() || '未登录'}</span>
            <Popconfirm title='确定注销当前账号吗?' onConfirm={() => this.props.onLogout(apiDomain)}>
              <Icon type='logout' style={{ display: localStorage.getItem('cname') ? 'inline-block' : 'none' }} />
            </Popconfirm>

          </span>
        </Header>
        <Content style={{ margin: '12px 12px 0', height: '100%' }}>
          {this.props.children}
        </Content>
        {
          needFooter ? <Footer style={{ textAlign: 'center' }}> Copyright © 2018 白山云科技</Footer> : null
        }
      </Layout >
    )
    return (
      <Router history={hashHistory}>
        {
          mode === 'sider+header' ? siderHeaderContainer
            : (mode === 'sider' ? siderContainer : headerContainer)
        }
      </Router >
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
    hashHistory.listen((location) => {
      this.log('hashHistory.listen', location.pathname)
      if (location.pathname !== '/') {
        let currentMenu = this.searchMenuByPath(menus, location.pathname)
        this.log('currentMenu', currentMenu)
        if (!!currentMenu) {
          let parentMenu = this.searchParentMenu(currentMenu, menus)
          this.log('parentMenu', parentMenu)
          document.title = currentMenu.name
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
  renderMenu = (menus = []) => {
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

  // 根据路径名过滤出菜单
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
  mode: PropTypes.string,                           // 菜单模式：sider+header;sider;header
  needFooter: PropTypes.bool,                       // 是否需要页脚
  menus: PropTypes.array,                           // 自定义菜单数据
  apps: PropTypes.object,                           // 自定义菜单数据
  contactors: PropTypes.array,                      // 自定义联系人数据
  onLogout: PropTypes.func,                         // 处理登出逻辑
  userName: PropTypes.string,                       // 自定义用户名数据
}
FrameLayout.defaultProps = {
  mode: 'sider+header',
  needFooter: true,
  onLogout: function (domain) {
    window.localStorage.clear()
    window.location.assign(domain + '/account/user/logout');
  }
}
