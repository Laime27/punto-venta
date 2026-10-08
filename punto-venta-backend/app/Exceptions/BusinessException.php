<?php

namespace App\Exceptions;

use Exception;

class BusinessException extends Exception
{
    
    public function report()
    {
       
    }

    
    public function render($request)
    {
        return response()->json([
            'message' => $this->getMessage(),
        ], 400);
    }
}
