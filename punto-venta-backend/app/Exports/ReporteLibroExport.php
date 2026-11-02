<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReporteLibroExport implements Export, WithMultipleSheets
{
    public function __construct(private array $hojas) {}

    public function sheets(): array
    {
        return $this->hojas;
    }
}
