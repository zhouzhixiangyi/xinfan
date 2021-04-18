import { createRouter, createWebHashHistory } from 'vue-router'

const router =  createRouter({
    history: createWebHashHistory(),
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

    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
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