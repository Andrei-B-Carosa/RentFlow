<?php

namespace App\Constants;

enum PaymentStatus:string
{
    case PENDING='PENDING';
    case PAID='PAID';
    case PARTIAL='PARTIAL';
    case LATE='LATE';
}
