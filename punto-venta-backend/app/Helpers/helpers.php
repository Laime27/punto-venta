<?php


    function anteponerCeros($numero)
    {
        return str_pad($numero, 8, '0', STR_PAD_LEFT);
    }
