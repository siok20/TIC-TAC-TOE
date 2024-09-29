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

¡Claro! Aquí te dejo una versión más sencilla y con un estilo más informal, como la de un estudiante que está documentando su proyecto:

---

## Documentación del Proyecto Tic-Tac-Toe en Línea

### 1. **Archivo: `app.js`**

Este archivo es donde está todo el backend de la aplicación. Básicamente, aquí definimos una API que permite crear partidas de Tic-Tac-Toe, hacer movimientos y ver el estado de las partidas.

1. **Configuración Inicial**:
   ```javascript
   const express = require('express');
   const app = express();

   app.use(express.json()); // Esto es para que la API pueda manejar JSON
   ```
   - Aquí usamos Express, que es un framework de Node.js para manejar peticiones HTTP fácilmente. También activamos el middleware `express.json()` para que pueda recibir datos en formato JSON.

2. **Variables Globales**:
   ```javascript
   let games = []; // Aquí guardamos todas las partidas activas
   let gameIdCounter = 1; // Un contador para asignar IDs únicos a cada partida
   const WINNING_COMBINATIONS = [ /* combinaciones ganadoras */ ];
   let scores = { X: 0, O: 0 }; // Puntuaciones de cada jugador
   ```
   - El array `games` almacena las partidas. Usamos un contador (`gameIdCounter`) para asignar un ID único a cada nueva partida. También tenemos las combinaciones ganadoras (por filas, columnas y diagonales) y un marcador de las puntuaciones.

3. **Rutas de la API**:
   - **Crear partida**:
     ```javascript
     app.post('/games', (req, res) => {
         const newGame = { /* Se configura la partida */ };
         games.push(newGame);
         res.status(201).json(newGame);
     });
     ```
     - Esta ruta se usa para crear una nueva partida. Cada vez que alguien la llama, se crea un nuevo tablero vacío y el primer turno es para el jugador 'X'.

   - **Obtener el estado de una partida**:
     ```javascript
     app.get('/games/:id', (req, res) => {
         const game = games.find(g => g.id === parseInt(req.params.id));
         if (!game) return res.status(404).json({ error: 'Partida no encontrada' });
         res.json(game);
     });
     ```
     - Aquí podemos consultar el estado de una partida usando el `id`. Si la partida no existe, devolvemos un error 404.

   - **Hacer un movimiento**:
     ```javascript
     app.patch('/games/:id', (req, res) => {
         const game = games.find(g => g.id === parseInt(req.params.id));
         // Aquí verificamos si la posición es válida y actualizamos el tablero
         res.json(game);
     });
     ```
     - En esta ruta es donde los jugadores hacen sus movimientos. Actualizamos el tablero, verificamos si hay un ganador, y cambiamos el turno al siguiente jugador.

---

### 2. **Archivo: `client.js`**

Este archivo es el cliente de consola que usamos para interactuar con la API. Básicamente, permite que juguemos Tic-Tac-Toe desde la terminal.

1. **Crear una nueva partida**:
   ```javascript
   const createGame = async () => {
       const response = await axios.post(URL);
       console.log('Partida creada:', response.data);
       return response.data.id; // Devuelve el id de la nueva partida
   };
   ```
   - Esta función hace una petición `POST` a la API para crear una nueva partida y devuelve el `id` de la misma. Imprime el estado inicial del tablero.

2. **Hacer un movimiento**:
   ```javascript
   const makeMove = async (gameId, playerId, position) => {
       const response = await axios.patch(`${URL}/${gameId}`, { playerId, position });
       console.log('Estado actualizado:', response.data);
       return response.data;
   };
   ```
   - Esta función envía un movimiento a la API, indicando la partida, el jugador ('X' o 'O') y la posición en el tablero donde quiere jugar.

3. **Juego en la consola**:
   ```javascript
   const main = async () => {
       const gameId = await createGame();
       while (true) {
           const gameState = await getGameState(gameId);
           // Verifica si hay ganador o empate, luego pide la posición al jugador y actualiza el estado
       }
   };
   ```
   - El flujo del juego está controlado aquí. Después de cada movimiento, el cliente verifica el estado de la partida (si hay ganador o empate) y sigue pidiendo posiciones a los jugadores.

---

### 3. **Archivo: `app.test.js`**

Este archivo contiene las pruebas del backend. Usamos `Jest` y `supertest` para asegurarnos de que todo funciona bien.

1. **Prueba de creación de partida**:
   ```javascript
   it('should create a new game', async () => {
       const res = await request(app).post('/games').send();
       expect(res.statusCode).toEqual(201);
       expect(res.body).toHaveProperty('id');
   });
   ```
   - Esta prueba se asegura de que la API crea una nueva partida correctamente. Además, verifica que el estado inicial del tablero es correcto.

2. **Prueba de movimientos válidos**:
   ```javascript
   it('should update the game state with a valid move', async () => {
       const res = await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 4 });
       expect(res.body.board[4]).toBe('X');
   });
   ```
   - Aquí comprobamos que cuando un jugador hace un movimiento válido, el tablero se actualiza correctamente.

3. **Prueba de empate**:
   ```javascript
   it('should detect a draw when the board is full', async () => {
       // Se simulan movimientos hasta que el tablero esté lleno
       const res = await request(app).patch(`/games/${gameId}`).send({ playerId: 'X', position: 6 });
       expect(res.body.status).toBe('Empate');
   });
   ```
   - Esta prueba verifica que la API detecta un empate cuando el tablero esté lleno y ya no hay más movimientos posibles.


### Ejemplo de Partida

#### Creación de la partida
    
![Partida creada](/tic-tac-toe/images/img1.png)

#### Movimiento 1

![Partida creada](/tic-tac-toe/images/img2.png)

#### Movimiento 2

![Partida creada](/tic-tac-toe/images/img3.png)

#### Movimiento 3

![Partida creada](/tic-tac-toe/images/img4.png)

#### Movimiento 4

![Partida creada](/tic-tac-toe/images/img5.png)

#### Movimiento 5

![Partida creada](/tic-tac-toe/images/img6.png)

#### Resultado Final

![Partida creada](/tic-tac-toe/images/img7.png)


## Conclusión
En esta primera parte del proyecto, logramos implementar una API REST básica junto con una consola para el juego Tic-Tac-Toe, utilizando Express para manejar las solicitudes HTTP y la lógica del juego. Esta API permite crear partidas, realizar movimientos y determinar el ganador o empate de manera efectiva. A pesar de que el juego aún no está en línea ni completamente desarrollado, este primer paso nos ha permitido comprender y manejar conceptos clave como la gestión del estado en un juego, la interacción cliente-servidor, y la verificación del flujo del juego mediante pruebas.

