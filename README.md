# pc1-grupo11
# Juego de Tic-Tac-Toe en Línea

## Descripción
Este proyecto nos ayuda a reforzar conocimientos sobre desarrollo de software, contenedorización y Git. Implementamos un juego de Tic-Tac-Toe a través de una API REST, junto con un cliente de consola.

## Requisitos del Proyecto

### Implementación de la lógica de Tic-Tac-Toe en la API REST 
- **Objetivo:** Implementar la lógica del juego Tic-Tac-Toe a través de una API REST. Los jugadores pueden hacer movimientos y la API determina el resultado de cada partida (ganador, empate, etc.).
- **Estado Actual:** 
  - Se ha implementado una API básica en `app.js` que permite:
    - Crear partidas.
    - Realizar movimientos.
    - Determinar el resultado de la partida (ganador o empate).
  - **Tecnologías Usadas:** Se utilizó Express (JavaScript) para implementar la lógica del juego.

#### Rutas Implementadas
- **POST /games:** Crea un nuevo juego y devuelve el estado inicial.
- **GET /games/:id:** Obtiene el estado actual de la partida.
- **PATCH /games/:id:** Actualiza el estado de la partida con un movimiento válido.

### Dockerización del juego de Tic-Tac-Toe
-  Usar Docker Compose para gestionar los servicios.
- **Estado Actual:**
  - Aún no se tiene implementado una base de datos que registre las puntuaciones.
  - Se ha añadido un `Dockerfile` para contenerizar la aplicación. Aquí está el contenido del Dockerfile:

```dockerfile
# Usa la imagen oficial de Node.js
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]

```

## Instrucciones para Ejecutar el Proyecto

Nota: Actualmente, estás en la rama feature/console, que contiene la primera versión del juego. Esta versión aún no está terminada y solo incluye las funcionalidades básicas.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Strangertame74/pc1-grupo11.git
   cd tic-tac-toe
   ```
2. **Dirígete a la rama `feature/console`**
  ```bash
    git checkout feature\console
  ```
3. **Instala las dependencias**
```bash
    npm install
```
4. **Ejecutar la aplicación:** Se necesita abrir 2 terminales
```bash
    node src/app.js
    node src/client.js
```
5. **Ejecutar pruebas**
```bash
    cd src
    npm test
```
