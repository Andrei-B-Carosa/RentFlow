<?php

namespace App;

enum Role: string
{
    case LANDLORD = 'LANDLORD';
    case TENANT = 'TENANT';
}

enum LeaseStatus: string
{
    case ACTIVE = 'ACTIVE';
    case EXPIRED = 'EXPIRED';
    case TERMINATED = 'TERMINATED';
}

enum PaymentStatus
{
    case PENDING;
    case PAID;
    case PARTIAL;
    case LATE;
}

enum MaintenancePriority
{
    case LOW;
    case MEDIUM;
    case HIGH;
    case URGENT;
}

enum MaintenanceStatus
{
    case OPEN;
    case IN_PROGRESS;
    case RESOLVED;
}

enum CalendarEventType
{
    case MOVE_IN;
    case MOVE_OUT;
    case INSPECTION;
    case RENEWAL;
}
