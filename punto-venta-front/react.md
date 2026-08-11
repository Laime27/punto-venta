# React Project Rules

## Arquitectura

Este proyecto utiliza el patrón **Feature-Based Architecture**.

Cada módulo o feature debe ser completamente independiente y contener sus propios archivos.

### Estructura obligatoria

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── validations/
│   │   └── index.tsx
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── validations/
│   │   └── index.tsx
```

Cada feature debe contener:

* components
* hooks
* services
* types
* validations
* index.tsx

No crear carpetas globales para componentes, hooks o servicios específicos de una feature.

---

## Tecnologías

### UI

Utilizar exclusivamente:

* React
* TypeScript
* Shadcn UI
* Tailwind CSS

No utilizar Bootstrap.

---

## Formularios

Todos los formularios deben utilizar:

* React Hook Form
* Zod

Ejemplo:

```tsx
const form = useForm<FormData>({
  resolver: zodResolver(FormSchema),
});
```

Las validaciones deben estar separadas dentro de:

```text
validations/
```

Ejemplo:

```text
auth/
├── validations/
│   └── AuthValidation.ts
```

---

## Hooks

La lógica de negocio del frontend debe ir en hooks personalizados.

Ejemplo:

```text
auth/
├── hooks/
│   └── useAuthHook.ts
```

Los componentes deben contener la menor lógica posible.

---

## Servicios

Las llamadas HTTP deben ir dentro de services.

Ejemplo:

```text
auth/
├── services/
│   └── AuthService.ts
```

No realizar llamadas Axios directamente desde componentes.

---

## Tipos

Todos los tipos e interfaces deben almacenarse dentro de:

```text
types/
```

Ejemplo:

```ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```

---

## Componentes

Los componentes deben ser pequeños y reutilizables.

Ejemplo:

```text
components/
├── LoginForm.tsx
├── LoginCard.tsx
├── LoginHeader.tsx
```

---

## Exportaciones

Cada feature debe exponer únicamente su punto de entrada mediante:

```text
index.tsx
```

Ejemplo:

```tsx
export { default } from "./pages/LoginPage";
```

---

## TypeScript

Reglas obligatorias:

* No utilizar any.
* Preferir unknown antes que any.
* Tipar props, estados y respuestas de API.
* Crear interfaces o types para toda estructura compleja.

Incorrecto:

```ts
const data: any
```

Correcto:

```ts
const data: UserResponse
```

---

## Axios

Toda comunicación con la API debe realizarse mediante servicios.

Incorrecto:

```tsx
axios.get(...)
```

Correcto:

```tsx
const users = await getUsers();
```

---

## Nomenclatura

Componentes:

```text
LoginForm.tsx
UserCard.tsx
ProductTable.tsx
```

Hooks:

```text
useAuthHook.ts
useUserHook.ts
```

Servicios:

```text
AuthService.ts
UserService.ts
```

Validaciones:

```text
AuthValidation.ts
UserValidation.ts
```

Tipos:

```text
AuthType.ts
UserType.ts
```

---

## Objetivo

Mantener una arquitectura modular, escalable y fácil de mantener basada en Features.
