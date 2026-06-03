export const ROUTES = {
    // Auth
    LOGIN: '/login',

    // Landlord
    LANDLORD: {
        DASHBOARD:   '/landlord/dashboard',
        PROPERTIES:  '/landlord/properties',
        PROPERTY_DETAIL: '/landlord/properties/:id',
        PROPERTY_UNITS: '/landlord/properties/:id/units',
        UNITS:       '/landlord/units',
        TENANTS:     '/landlord/tenants',
        TENANT_DETAIL:'/landlord/tenants/:id',
        LEASES:      '/landlord/leases',
        PAYMENTS:    '/landlord/payments',
        MAINTENANCE: '/landlord/maintenance',
    },

    // Tenant
    TENANT: {
        UNIT:        '/tenant/unit',
        LEASE:       '/tenant/lease',
        PAYMENTS:    '/tenant/payments',
        MAINTENANCE: '/tenant/maintenance',
    },
} as const;