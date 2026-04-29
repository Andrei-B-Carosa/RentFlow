<?php

namespace App\Constants;

enum MaintenancePriority:string
{
    case LOW = 'LOW';
    case MEDIUM = 'MEDIUM';
    case HIGH = 'HIGH';
    case URGENT = 'URGENT';
}
