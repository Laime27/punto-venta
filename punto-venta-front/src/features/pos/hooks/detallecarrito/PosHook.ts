import { useState, useEffect } from "react";
import {listarMetodoPagoTodos } from "@/features/metodopago/services/MetodopagoService";

export const usePosHook = () => {
  
  const [listaMetodoPago, setListaMetodoPago] = useState([]);


  useEffect(() => {
      listarMetodoPago()
  }, []);


  const listarMetodoPago = async () => {
    const data = await listarMetodoPagoTodos();
    setListaMetodoPago(data);
  };  

  return {
    listaMetodoPago,
  
  };
};
