import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                    if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '主页', icon: 'dashboard' }
      }
    ]
  },
  // 权限管理
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/user',
    name: 'Authority',
    meta: { title: '权限管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/Authority/UserCom'),
        meta: { title: '账号管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/Authority/RoleCom'),
        meta: { title: '角色管理', icon: 'el-icon-s-custom' }
      },
      {
        path: 'resources',
        name: 'Resources',
        component: () => import('@/views/Authority/ResourcesCom'),
        meta: { title: '资源管理', icon: 'el-icon-s-unfold' }
      }
    ]
  },

  {
    path: '/ProductManage',
    component: Layout,
    redirect: '/ProductManage/productList',
    name: 'ProductManage',
    alwaysShow: true,
    meta: { title: '商品管理', icon: 'el-icon-takeaway-box' },
    children: [
      {
        path: 'productList',
        name: 'ProductList',
        component: () => import('@/views/ProductManage/productList/index'),
        meta: { title: '商品列表', icon: 'el-icon-shopping-cart-full' }
      },
      {
        path: 'category',
        name: 'ProductCateGroy',
        component: () => import('@/views/ProductManage/productList/categroy'),
        meta: { title: '商品分类', icon: 'el-icon-menu' }
      },
      {
        path: 'productMain',
        name: 'ProductMain',
        component: () => import('@/views/ProductManage/productMain/index'),
        meta: { title: '品牌管理', icon: 'el-icon-present' }
      },
      {
        path: 'addProduct',
        name: 'AddProduct',
        // 默认不展示
        hidden: true,
        component: () => import('@/views/ProductManage/productList/AddOrEditProduct'),
        meta: { title: '新增商品', icon: 'el-icon-shopping-cart-full', activeMenu: '/ProductManage/productList' }
      },
      {
        path: 'editProduct/:id',
        name: 'EditProduct',
        // 默认不展示
        hidden: true,
        component: () => import('@/views/ProductManage/productList/AddOrEditProduct'),
        meta: { title: '编辑商品', icon: 'el-icon-shopping-cart-full', activeMenu: '/ProductManage/productList' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderlist',
    name: 'Order',
    alwaysShow: true,
    meta: { title: '订单管理', icon: 'el-icon-attract' },
    children: [
      {
        path: 'orderlist',
        name: 'OrderList',
        component: () => import('@/views/order/list/index'),
        meta: { title: '订单列表', icon: 'el-icon-folder-checked' }
      },
      {
        path: 'orderDetail/:id',
        name: 'OrderDetail',
        // 默认不展示
        hidden: true,
        component: () => import('@/views/order/list/OrderDetail'),
        meta: { title: '当前订单', icon: 'el-icon-folder-checked', activeMenu: '/order/orderlist' }
      },
      {
        path: 'chargeback',
        name: 'ChargeBack',
        component: () => import('@/views/order/list/chargeback'),
        meta: { title: '退单列表', icon: 'el-icon-folder-delete' }
      },
      {
        path: 'backdetail/:id',
        name: 'BackDetail',
        // 默认不展示
        hidden: true,
        component: () => import('@/views/order/list/backdetail'),
        meta: { title: '退单详情', icon: 'el-icon-folder-checked', activeMenu: '/order/chargeback' }
      },
      {
        path: 'address',
        name: 'AddressList',
        component: () => import('@/views/order/address/index'),
        meta: { title: '地址管理', icon: 'el-icon-delete-location' }
      }
    ]
  },

  {
    path: '/content',
    component: Layout,
    redirect: '/content/article',
    name: 'Content',
    meta: { title: '内容管理', icon: 'el-icon-receiving' },
    children: [
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/content/article/index'),
        meta: { title: '文章管理', icon: 'el-icon-document' }
      },
      {
        // 新增
        path: 'addArticle',
        name: 'addArticle',
        hidden: true, // 隐藏侧边栏
        component: () => import('@/views/content/article/AddOrEditArticle'),
        // activeMenu: '/content/article'  添加这个activeMenu 可以让他让他的父路由继续高亮
        meta: { title: '新增文章', icon: 'el-icon-document', activeMenu: '/content/article' }
      },
      // 编辑params传参 地址栏 / /
      {
        path: 'editArticle/:id',
        name: 'EditArticle',
        hidden: true, // 隐藏侧边栏
        component: () => import('@/views/content/article/AddOrEditArticle'),
        meta: { title: '编辑文章', icon: 'el-icon-document', activeMenu: '/content/article' }
      },
      {
        path: 'material',
        name: 'Material',
        component: () => import('@/views/content/material/index'),
        meta: { title: '素材管理', icon: 'el-icon-document' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () =>
                  import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
