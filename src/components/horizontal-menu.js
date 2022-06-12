export const menuItems = [{
        id: 1,
        label: 'menuitems.dashboard.text',
        icon: 'uil-home-alt',
        link: '/'
    },
    {
        id: 2,
        label: 'Manage Patients',
        icon: 'uil-users-alt',
        subItems: [{
            id: 1,
            label: 'Patients',
            link: '/patients'
        }, ]
    },
    {
        id: 2,
        label: 'Data Sync',
        icon: 'uil-books',
        subItems: [{
                id: 1,
                label: 'Manage',
                link: '/manage'
            },

        ]
    },
    {
        id: 2,
        label: 'Revenue',
        icon: 'uil-apps',
        subItems: [{
                id: 1,
                label: 'Income',
                link: '/income'
            },
            {
                id: 2,
                label: 'Expenses',
                link: '/expenses'
            },
        ]
    },
    {
        id: 2,
        label: 'Front CMS',
        icon: 'uil-apps',
        subItems: [{
                id: 1,
                label: 'Comments',
                link: '/comments'
            },
            {
                id: 2,
                label: 'Complaints',
                link: '/complaints'
            },
            {
                id: 3,
                label: 'Suggestions',
                link: '/suggestions'
            },
        ]
    },


]