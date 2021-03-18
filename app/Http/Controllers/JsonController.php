<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;

class JsonController extends Controller
{
    public function store(Request $request) { 
       

        $test = new Test;

        $test->data = json_encode($request->all());
        $test->save();

        return 'ok';
        
    }
}
