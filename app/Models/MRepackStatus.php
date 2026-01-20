<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MRepackStatus extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'm_repack_status';

    protected $guarded = [];
}
