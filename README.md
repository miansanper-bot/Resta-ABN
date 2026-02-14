# 🐸 SaltoMates ABN: Guía Didáctica de la Resta

Bienvenido a la plataforma interactiva de **SaltoMates ABN**. Este proyecto es una herramienta pedagógica diseñada para el aprendizaje de la resta posicional, eliminando la memorización mecánica y sustituyéndola por la comprensión lógica.

---

## 1. Marco Teórico: El Modelo M.G.A.
El diseño de esta aplicación se basa en el enfoque **MGA (Manipulativo - Gráfico - Abstracto)**. Para que un alumno interiorice conceptos complejos como la resta con llevadas, debe transitar por cuatro etapas cognitivas:

### A. FASE MANIPULATIVA (Pestaña "Mesa")
*El conocimiento se adquiere a través de la acción física.*
- **En la App:** El alumno manipula "bloques" digitales de centenas, decenas y unidades.
- **🔑 Concepto Clave:** **Conservación de la Cantidad**. Cuando el alumno usa el martillo (🔨) para romper una decena en 10 unidades, visualiza que la cantidad total no ha cambiado, solo su forma. Esto elimina el concepto abstracto de "me llevo una".

### B. FASE GRÁFICA (Pestaña "Rana")
*La información se representa mediante diagramas visuales.*
- **En la App:** Utilización de la **Recta Numérica**.
- **🔑 Concepto Clave:** **Resta por Ascendencia**. Se entiende como "distancia": ¿Cuánto le falta al pequeño para llegar al grande? Es un recorrido, no una eliminación.

### C. FASE DE TRANSICIÓN SIMBÓLICA (Pestaña "Descomposición")
*El puente entre la manipulación de piezas y el algoritmo final.*
- **En la App:** El alumno descompone el minuendo y el sustraendo en sus órdenes de magnitud antes de operar.
- **🔑 Concepto Clave:** **Valor Posicional y Reagrupamiento**. A diferencia de la resta tradicional, el alumno resta cada posición con sentido numérico total. Si una columna es insuficiente, el sistema le guía para volver a la fase manipulativa y reagrupar.

### D. FASE ABSTRACTA (Pestaña "Rejilla")
*Uso de símbolos (números) para describir la experiencia.*
- **En la App:** La rejilla clásica ABN.
- **🔑 Concepto Clave:** **Algoritmo Abierto**. El alumno decide "cuánto quiere quitar" en cada paso según su capacidad de cálculo mental, fomentando la autonomía.

---

## 2. Justificación de Diseño

* **🎨 Código de Colores:** Uso estricto de **Amarillo (100)**, **Rojo (10)** y **Azul (1)** para reducir la carga cognitiva y asociar posición con valor.
* **🔨 Herramienta "Martillo":** Obliga a la descomposición física de la decena, previniendo el error común de restar el número menor al mayor sin importar la posición (ej: en $42 - 19$, hacer $9 - 2 = 7$).
* **🧠 Modo "Reto Mental":**
    * **Sin Reto:** Automático, para aprendizaje inicial.
    * **Con Reto:** Manual, fuerza la **metacognición** al obligar a predecir el resultado del movimiento.

---

## 3. Ejemplo Práctico: $234 - 156$

### Escenario 1: La Mesa
1. Pasa 1 bloque amarillo (100) a la derecha.
2. Intenta pasar 50 (rojo), pero solo hay 30. **Solución:** Usa el **Martillo 🔨** en una centena.
3. Ahora tienes 13 decenas. Pasa las 5 decenas.
4. Intenta pasar 6 unidades, pero solo hay 4. **Solución:** Usa el **Martillo 🔨** en una decena.
5. Pasa las 6 unidades. **Resultado:** Quedan 78.

### Escenario 2: La Rana
*Objetivo: Ir de 156 a 234.*
- Salto **+4** (llega a 160).
- Salto **+40** (llega a 200).
- Salto **+34** (llega a 234).
- **Total:** $4 + 40 + 34 = 78$.

### Escenario 3: La Rejilla ABN
| QUITO | FALTA | QUEDA | Explicación Mental |
| :--- | :--- | :--- | :--- |
| 100 | 56 | 134 | Quito las centenas primero. |
| 30 | 26 | 104 | Quito las 30 decenas sueltas. |
| 4 | 22 | 100 | Quito las 4 unidades sueltas. |
| 20 | 2 | 80 | Del 100 quito 20 (amigos del 100). |
| 2 | 0 | 78 | Quito lo último. Fin. |

### Escenario 4: La Resta por Descomposición
*Objetivo: Desarmar los números para restar "pedazo a pedazo" según su valor.*

| Posición | Minuendo (234) | Sustraendo (156) | Resultado Parcial |
| :--- | :--- | :--- | :--- |
| **Centenas** | 100 | 100 | 0 |
| **Decenas** | 120 | 50 | 70 |
| **Unidades** | 14 | 6 | 8 |
| **TOTAL** | | | **78** |

**Explicación Lógica:**
- **Conflicto en Centenas:** Se restan 100 del sustraendo a 100 del minuendo.
- **Conflicto en Decenas:** Al necesitar quitar 50 y tener solo 30, se reagrupa una centena (se convierte en 130 decenas), dejando 120 para restar 50.
- **Conflicto en Unidades:** Se necesita quitar 6 y hay 4. Se pasa una decena (10) a las unidades, sumando 14 para sustraer 6.
- **Suma Final:** $0 + 70 + 8 = 78$.

---

## 🚀 Acceso y Licencia
Esta es una **herramienta nativa web** para uso educativo. No requiere instalación.

**© 2026 SaltoMates ABN.** Todos los derechos reservados. Se permite el uso gratuito en entornos educativos a través de su URL oficial. No se permite la descarga, redistribución o uso comercial del código fuente.
