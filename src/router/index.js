import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory() // 引入路由方式

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            component: () => import('../layouts/index'),
            meta: {
                //title: '信访后台系统',  
            },
            children: [
                {
                    path: 'add',
                    component: () => import('../views/add'),
                    meta: {
                        title: '添加数据',
                    }
                },
                {
                    path: 'list',
                    component: () => import('../views/list'),
                    meta: {
                        title: '数据列表',
                    }
                },
                {
                    path: 'edit/:id',
                    component: () => import('../views/add'),
                    meta: {
                        title: '添加数据',
                    }
                },
                {
                    path: 'see/:id',
                    component: () => import('../views/see'),
                    meta: {
                        title: '查看数据',
                    }
                }
                ,
                {
                    path: 'monthReport',
                    component: () => import('../views/monthReport'),
                    meta: {
                        title: '月报',
                    }
                }
                ,
                {
                    path: 'otherReport',
                    component: () => import('../views/otherReport'),
                    meta: {
                        title: '季报或年报',
                    }
                }

            ]
        },
        {
            path: '/login',
            component: () => import('../views/login'),
            meta: {
                title: '登录'
            }
        }
        ,
        {
            path: '/test',
            component: () => import('../views/test'),
            meta: {
                title: '测试'
            }
        },
        {
            path: '/login2',
            component: () => import('../views/login2'),
            meta: {
                title: '登录'
            }
        }
        ,

    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/login2') {
        next()
    } else {
        let token = localStorage.getItem('token')
        if (!token) {
            next('/login')
        } else {
            next()
        }
    }
})

export default router