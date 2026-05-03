export const ROUTES = {
    // Auth
    LOGIN: '/login',

    // Landlord
    LANDLORD: {
        DASHBOARD:   '/landlord/dashboard',
        PROPERTIES:  '/landlord/properties',
        PROPERTY_DETAIL: '/landlord/properties/:id',
        UNITS:       '/landlord/units',
        TENANTS:     '/landlord/tenants',
        LEASES:      '/landlord/leases',
        PAYMENTS:    '/landlord/payments',
        MAINTENANCE: '/landlord/maintenance',
    },

    // Tenant
    TENANT: {
        DASHBOARD:   '/tenant/dashboard',
        UNIT:        '/tenant/unit',
        LEASE:       '/tenant/lease',
        PAYMENTS:    '/tenant/payments',
        MAINTENANCE: '/tenant/maintenance',
    },
} as const;