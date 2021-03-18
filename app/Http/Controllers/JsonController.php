<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;

class JsonController extends Controller
{
    public function store(Request $request) { 
       

        $test = new Test;

        $test->data = $request->input('jCoords');
        $test->save();

        

        return "success";
    }
}
