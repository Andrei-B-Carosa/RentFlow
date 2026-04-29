<?php

namespace App\Constants;

enum UnitStatus:string
{
    case VACANT     = 'VACANT';
    case OCCUPIED   = 'OCCUPIED';
    case UNDER_MAINTENANCE = 'UNDER_MAINTENANCE';
}
