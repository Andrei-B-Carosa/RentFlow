<?php

namespace App\Constants;

enum CalendarEventType:string
{
    case MOVE_IN ='MOVE_IN';
    case MOVE_OUT = 'MOVE_OUT';
    case INSPECTION = 'INSPECTION';
    case RENEWAL = 'RENEWAL';
}
