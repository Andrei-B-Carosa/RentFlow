<?php

namespace App\Constants;

enum LeaseStatus: string
{
    case ACTIVE = 'ACTIVE';
    case EXPIRED = 'EXPIRED';
    case TERMINATED = 'TERMINATED';
}
