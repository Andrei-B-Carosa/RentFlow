<?php

namespace App\Constants;

enum PaymentStatus:string
{
    case PENDING='PENDING';
    case PAID='PAID';
    case PARTIAL='PARTIAL';
    case LATE='LATE';
}

enum PaymentType:string
{
    case RENT='RENT';
    case EXTRA_CHARGE='EXTRA_CHARGE';
    case DEPOSIT='DEPOSIT';
}
