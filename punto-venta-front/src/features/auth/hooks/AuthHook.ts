import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthSchema, type AuthFormData } from "../validations/AuthValidation"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { loginAuth } from "../services/AuthService"
import { setToken } from "@/lib/cookie"

export const useAuthHook = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
      const response = await loginAuth(data)
      toast.success(response.message)
      setToken(response.token)
      navigate("/dashboard")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error desconocido")
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
