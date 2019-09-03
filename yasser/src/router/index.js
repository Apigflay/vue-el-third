import Vue from 'vue'
import Router from 'vue-router' 
import Login from '@/components/Login' //登录
import Error from '@/components/Error' //错误
import Nav from '@/components/Nav' //导航栏
import Sidebar from '@/components/Sidebar' //侧边栏
import Dask from '@/components/Dask' //首页
// ------new-------
import Hostduration from '@/components/pages/Hostduration' //主播时长
import Anchordoll from '@/components/pages/Anchordoll' //主播娃娃
import Anchorpipeline from '@/components/pages/Anchorpipeline' //主播流水
import Anchormanagement from '@/components/pages/Anchormanagement' //主播管理
import Passwordmodification from '@/components/pages/Passwordmodification' //密码修改
// 四个菜单：1.主播时长   2. 主播娃娃   3. 主播流水   4. 主播管理  5. 密码修改
Vue.use(Router)
// import VueCookies from 'vue-cookies'
// Vue.use(VueCookies)
const router= new Router({
  // mode:'history',
  routes: [
    {
      path:'*',
      component:Error
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
     {
      path: '/',//首页
      name: 'Index',
      components: {
        // default:Header,
        // default:Footer
        nav:Nav,
        main:Dask,
        sidebar:Sidebar
      }
    },
    // ----new-----
    {
      path: '/hostduration',//主播时长
      name: 'Hostduration',
      components: {
        // default:Header,
        // default:Footer
        nav:Nav,
        main:Hostduration,
        sidebar:Sidebar
      }
    },
    {
      path: '/anchordoll',//主播娃娃
      name: 'Anchordoll',
      components: {
        // default:Header,
        // default:Footer
        nav:Nav,
        main:Anchordoll,
        sidebar:Sidebar
      }
    },
    {
      path: '/anchorpipeline',//主播流水
      name: 'Anchorpipeline', 
      components: {
        // default:Header,
        // default:Footer
        nav:Nav,
        main:Anchorpipeline,
        sidebar:Sidebar
      }
    },
    {
      path: '/anchormanagement',//主播管理
      name: 'Anchormanagement',
      components: {
        // default:Header,
        // default:Footer
        nav:Nav,
        main:Anchormanagement,
        sidebar:Sidebar
      }
    },
    {
      path: '/passwordmodification',//密码修改
      name: 'Passwordmodification', 
      components: {
        // default:Header,
        // default:Footer
        nav:Nav,
        main:Passwordmodification,
        sidebar:Sidebar
      }
    },
    // ----new-----
  ]
})
// 全局路由守卫
router.beforeEach((to, from, next) => {
  // console.log('navigation-guards');
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  //'Index', 'Cpassword','Privilege','Role','Operators','SaleManage','RetailProduct','RetailPay','productlist','activitylist','salesman','Stock','Wholesale','Warehouse','Retail','Warehouse','Warehouseinfo'
  const nextRoute = ['Index','Hostduration','Anchordoll','Anchorpipeline','Anchormanagement','Passwordmodification'];
  let isLogin=localStorage.getItem("g_third_userName");// 是否登录
  // console.log(isLogin);
  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.name) >= 0) { 
    if (isLogin==null) {
      // console.log('what fuck');
      router.push({ name: 'Login' })
    }
  }
  // 已登录状态；当路由到login时，跳转至home
  if (to.name === 'Login') {
    if (isLogin) {
      router.push({ name: 'Index' });
    }
  }
  next();
});
export default router
