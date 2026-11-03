<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RespaldoService
{
    private const TABLAS_SIN_DATOS = ['cache', 'cache_locks', 'sessions', 'jobs', 'job_batches', 'failed_jobs', 'personal_access_tokens'];
    private const FILAS_POR_INSERT = 200;

    public function generar(): string
    {
        $directorio = storage_path('app/private/respaldos');
        File::ensureDirectoryExists($directorio);

        $nombre = 'respaldo_' . now()->format('Y-m-d_His');

        return DB::getDriverName() === 'sqlite'
            ? $this->respaldarSqlite("{$directorio}/{$nombre}.sqlite")
            : $this->respaldarMysql("{$directorio}/{$nombre}.sql");
    }

    private function respaldarSqlite(string $ruta): string
    {
        DB::statement('VACUUM INTO ?', [$ruta]);

        return $ruta;
    }

    private function respaldarMysql(string $ruta): string
    {
        $archivo = fopen($ruta, 'w');

        fwrite($archivo, "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\n\n");

        foreach (DB::select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"') as $fila) {
            $this->escribirTabla($archivo, array_values((array) $fila)[0]);
        }

        fwrite($archivo, "SET FOREIGN_KEY_CHECKS=1;\n");
        fclose($archivo);

        return $ruta;
    }

    private function escribirTabla($archivo, string $tabla): void
    {
        $estructura = DB::selectOne("SHOW CREATE TABLE `{$tabla}`");

        fwrite($archivo, "DROP TABLE IF EXISTS `{$tabla}`;\n{$estructura->{'Create Table'}};\n\n");

        if (in_array($tabla, self::TABLAS_SIN_DATOS)) {
            return;
        }

        $pdo = DB::getPdo();
        $valores = [];

        foreach (DB::table($tabla)->cursor() as $fila) {
            $valores[] = '(' . collect((array) $fila)
                ->map(fn ($valor) => $valor === null ? 'NULL' : $pdo->quote((string) $valor))
                ->implode(',') . ')';

            if (count($valores) === self::FILAS_POR_INSERT) {
                $this->escribirInsert($archivo, $tabla, $valores);
                $valores = [];
            }
        }

        if ($valores) {
            $this->escribirInsert($archivo, $tabla, $valores);
        }

        fwrite($archivo, "\n");
    }

    private function escribirInsert($archivo, string $tabla, array $valores): void
    {
        fwrite($archivo, "INSERT INTO `{$tabla}` VALUES " . implode(",\n", $valores) . ";\n");
    }
}
