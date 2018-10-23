import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import FrameLayout from './FrameLayout'

// const domain = "http://test-roster.i.trpcdn.net"
// const domain = "http://test-pps.i.trpcdn.net"
// const domain='http://172.18.11.112:11001'

const contactors = [
  {
    name: '王远洋',
    phone: '18150163382',
    qq: '383881952'
  },
  {
    name: '范溢贞',
    phone: '18106987196',
    qq: '614235948'
  }
]
const siderMenuConfig = [
  {
    name: '质量概况',
    to: '/quality',
    key: '/quality',
    iconType: 'solution'
  },
  {
    name: '调度',
    to: '/dispatch',
    key: '/dispatch',
    iconType: 'solution',
    subs: [
      {
        name: '厂商配置列表1',
        to: '/dispatch/SupplierManage',
        key: '/dispatchSupplierManage',
      },
      {
        name: '融合关系配置列表1',
        to: '/dispatch/RelationConfigManage',
        key: '/dispatchRelationConfigManage',
      }
    ]
  },
  {
    name: '配置',
    to: '/config',
    iconType: 'home',
    key: '/config',
    subs: [
      {
        name: '厂商配置列表',
        to: '/config/SupplierManage',
        key: '/SupplierManage',
      },
      {
        name: '融合关系配置列表',
        to: '/config/RelationConfigManage',
        key: '/RelationConfigManage',
      }
    ]
  }
]
const domain = 'http://172.18.11.112:40080'

export default class demo extends React.Component {
  render() {
    return (
      // <FrameLayout
      //   apiDomain="http://test-pps.i.trpcdn.net"
      //   logo="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
      //   appName="PPS"
      //   contactors={contactors}
      //   mode="sider+header"
      // >
      //   <div style={{ height: 1200, width: '100%' }}>
      //     <Switch>
      //       {
      //         (JSON.parse(localStorage.getItem('menu')) || []).map(menu => (
      //           <Route exact path={menu.to} render={() => <h1>{menu.name}</h1>} />
      //         ))
      //       }
      //       <Route exact path='/403' render={() => <h1>/403</h1>} />
      //       <Redirect exact to='/403' path='/' />
      //     </Switch>
      //   </div>
      // </FrameLayout>

      <FrameLayout
        apiDomain={domain}
        logo="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
        appName="测试平台"
        menus={siderMenuConfig}
        apps={{}}
        mode="sider+header"
        userName='fanyizhen'
        allowExpandMultiMenus={true}
      >
        <div style={{ height: 1200, width: '100%' }}>
          <Switch>
            {
              siderMenuConfig.map(menu => (
                <Route exact path={menu.to} render={() => <h1>{menu.name}</h1>} />
              ))
            }
            <Route exact path={"/quality/:id"} render={() => <h1>dasdasda</h1>} />
          </Switch>
        </div>
      </FrameLayout>


    )
  }
}
