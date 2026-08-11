

#!/bin/bash

# 1. Validación de entrada
FEATURE_NAME=$1
if [ -z "$FEATURE_NAME" ]; then
  echo "❌ Error: Indica el nombre de la feature."
  exit 1
fi

# 2. Formateo de nombres (Soporta paths anidados)
SIMPLE_NAME=$(basename "$FEATURE_NAME")
CAP_NAME=$(echo "$SIMPLE_NAME" | sed -r 's/(^|-|_)([a-z])/\U\2/g')
LOW_NAME=$(echo "$SIMPLE_NAME" | tr '[:upper:]' '[:lower:]')

# 3. Ruta base
BASE_DIR="src/features/$FEATURE_NAME"

# 4. Crear estructura (Incluyendo validations)
mkdir -p "$BASE_DIR/"{services,components,hooks,types,pages,validations}

# --- Creación de Archivos ---

# Component
cat <<EOF > "$BASE_DIR/components/${CAP_NAME}Component.tsx"
export const ${CAP_NAME}Component = () => {
  return (
    <div className="p-4 border rounded-md">
      ${CAP_NAME} Component Content
    </div>
  );
};
EOF

# Types
cat <<EOF > "$BASE_DIR/types/${CAP_NAME}Type.ts"
export interface ${CAP_NAME}Type {
  id: number;
  createdAt: string;
}
EOF

# Validations (Ejemplo base para Zod o validación manual)
cat <<EOF > "$BASE_DIR/validations/${CAP_NAME}Validation.ts"
// Aquí puedes usar Zod o definir tus reglas
export const ${CAP_NAME}Schema = {
  // name: z.string().min(3),
};
EOF

# Hooks
cat <<EOF > "$BASE_DIR/hooks/${CAP_NAME}Hook.ts"
import { useState } from 'react';

export const use${CAP_NAME}Hook = () => {
  const [data, setData] = useState(null);
  return { data, setData };
};
EOF

# Service (Axios config global)
cat <<EOF > "$BASE_DIR/services/${CAP_NAME}Service.ts"
import axios from "@/lib/axiosConfig";

export const list${CAP_NAME} = async () => {
  const { data } = await axios.get("/${LOW_NAME}");
  return data;
};
EOF

# Page (Vacío por diseño)
touch "$BASE_DIR/pages/${CAP_NAME}Page.tsx"

# Index.tsx (Punto de entrada de la feature)
cat <<EOF > "$BASE_DIR/index.tsx"
import { ${CAP_NAME}Component } from './components/${CAP_NAME}Component';

export default function ${CAP_NAME}() {
  return (
    <div>
      <${CAP_NAME}Component />
    </div>
  );
}
EOF

echo "✅ Feature '$FEATURE_NAME' creada con éxito."
echo "📂 Carpeta de validaciones incluida: $BASE_DIR/validations/"