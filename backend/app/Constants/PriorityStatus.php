<?php

namespace App\Constants;

enum PriorityStatus:string
{
    case LOW ='LOW';
    case MEDIUM ='MEDIUM';
    case HIGH = 'HIGH';
    case URGENT = 'URGENT';
}
