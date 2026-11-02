
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useAuthHook } from "../hooks/AuthHook";

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, errors, onSubmit, loading } = useAuthHook();

  return (
    <div className="grid gap-6 w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="text"
              autoComplete="email"
              disabled={loading}
              placeholder="prueba@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="error-validation ">{errors.email.message}</p>
            )}

          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                placeholder="*******"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="error-validation ">{errors.password.message}</p>
            )}
          </div>
          <Button disabled={loading} className="mt-2">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </Button>
        
        </div>
      </form>
    </div>
  )
}