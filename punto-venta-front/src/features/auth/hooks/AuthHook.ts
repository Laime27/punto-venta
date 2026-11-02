import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { AuthSchema, type AuthFormData } from "../validations/AuthValidation"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { loginAuth, SESION_QUERY_KEY } from "../services/AuthService"
import { setToken } from "@/lib/cookie"
import { getErrorMessage } from "@/lib/errorHandler"
import type { SesionType } from "../types/AuthType"

export const useAuthHook = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(AuthSchema),
  })

  const onSubmit = async (data: AuthFormData) => {
    try {
      setLoading(true)
      const { message, token, ...sesion } = await loginAuth(data)
      queryClient.clear()
      setToken(token)
      queryClient.setQueryData<SesionType>(SESION_QUERY_KEY, sesion)
      toast.success(message)
      navigate("/dashboard")
    } catch (error) {
      toast.error(getErrorMessage(error, "Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
  }
}
