import store from '@/state/store'

export default [{
    path: '/login',
    name: 'login',
    component: () =>
        import('../views/pages/account/login'),
    meta: {
        beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
                // Redirect to the home page instead
                next({
                    name: 'home'
                })
            } else {
                // Continue to the login page
                next()
            }
        },
    },
},
{
    path: '/register',
    name: 'register',
    component: () =>
        import('../views/pages/account/register'),
    meta: {
        beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
                // Redirect to the home page instead
                next({
                    name: 'home'
                })
            } else {
                // Continue to the login page
                next()
            }
        },
    },
},
{
    path: '/forgot-password',
    name: 'Forgot-password',
    component: () =>
        import('../views/pages/account/forgot-password'),
    meta: {
        beforeResolve(routeTo, routeFrom, next) {
            // If the user is already logged in
            if (store.getters['auth/loggedIn']) {
                // Redirect to the home page instead
                next({
                    name: 'manage'
                })
            } else {
                // Continue to the login page
                next()
            }
        },
    },
},
{
    path: '/logout',
    name: 'logout',
    meta: {
        authRequired: true,
        beforeResolve(routeTo, routeFrom, next) {
            if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
                store.dispatch('auth/logOut')
            } else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
                store.dispatch('authfack/logout')
            }
            const authRequiredOnPreviousRoute = routeFrom.matched.some(
                (route) => route.push('/login')
            )
            // Navigate back to previous page, or home as a fallback
            next(authRequiredOnPreviousRoute ? {
                name: 'home'
            } : {
                ...routeFrom
            })
        },
    },
}, {
    path: '/',
    name: 'home',
    meta: {
        authRequired: false,
    },
    component: () =>
        import('../views/pages/dashboard/index')
},
{
    path: '/data/indicators',
    name: 'indicators',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/data/indicators')
},
{
    path: '/data/indicators',
    name: 'indicators',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/data/indicators')
},
{
    path: '/data/FacilityMapping',
    name: 'Facility Mapping',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/data/FacilityMapping')
},
{
    path: '/data/comparison',
    name: 'comparison',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/data/comparison')
},
{
    path: '/data/indicator_groups',
    name: 'reserve',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/data/indicator_groups')
},
{
    path: '/data/DataPullSchedule',
    name: 'income',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/data/DataPullSchedule')
},
{
    path: '/account/users',
    name: 'users',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/account/users')
},
{
    path: '/account/roles',
    name: 'roles',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/account/roles')
},
{
    path: '/reporting/report',
    name: 'Reports',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/reporting/report')
},
{
    path: '/suggestions',
    name: 'suggestions',
    meta: {
        authRequired: true,
    },
    component: () =>
        import('../views/pages/cms/suggestions')
},
]