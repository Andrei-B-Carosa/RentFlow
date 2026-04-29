<?php

namespace App\Constants;

enum MaintenanceStatus:string
{
    case OPEN='OPEN';
    case IN_PROGRESS='IN_PROGRESS';
    case RESOLVED='RESOLVED';
}
