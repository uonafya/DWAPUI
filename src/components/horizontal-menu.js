export const menuItems = [{
        id: 1,
        label: 'menuitems.dashboard.text',
        icon: 'uil-home-alt',
        link: '/'
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
            {
                id: 2,
                label: 'Indicators',
                link: '/indicators'
            },
            {
                id: 3,
                label: 'Indicators Groups',
                link: '/indicator_groups'
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