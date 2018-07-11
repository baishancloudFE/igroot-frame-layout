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
export default () => {
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
      apiDomain='http://172.18.11.112:11001'
      logo="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
      appName="测试平台"
      menus={JSON.parse(localStorage.getItem('MENU_INFO')).data}
      apps={JSON.parse(localStorage.getItem('apps')).data}
      userName={JSON.parse(localStorage.getItem('cname')).data}
    >
      <div style={{ height: 1200, width: '100%' }}>
        <Switch>
          {
            (JSON.parse(localStorage.getItem('menu')) || []).map(menu => (
              <Route exact path={menu.to} render={() => <h1>{menu.name}</h1>} />
            ))
          }
          <Route exact path='/403' render={() => <h1>/403</h1>} />
          <Redirect exact to='/403' path='/' />
        </Switch>
      </div>
    </FrameLayout>

  )
}
