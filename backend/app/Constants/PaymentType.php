<?php

namespace App\Constants;

enum PaymentType:string
{
    case RENT='RENT';
    case EXTRA_CHARGE='EXTRA_CHARGE';
    case DEPOSIT='DEPOSIT';
}
