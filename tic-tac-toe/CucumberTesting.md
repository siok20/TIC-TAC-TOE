## 1. Introducción

Estoy utilizando Cucumber para hacer pruebas de aceptación en mi proyecto de Tic-Tac-Toe. Este enfoque se basa en Behavior-Driven Development (BDD), que busca que todos los involucrados en el proyecto puedan comprenderlo, incluyendo desarrolladores, testers y stakeholders. Cucumber es útil porque me permite escribir pruebas en un lenguaje natural (Gherkin) que cualquiera puede entender, incluso sin conocimientos de programación. Básicamente, voy a describir el comportamiento de mi aplicación mediante archivos `.feature`, que serán traducidos a código usando archivos de pasos.


La idea es dividir las pruebas en tres partes:
- **Dado** (Given): Define el contexto inicial.
- **Cuando** (When): La acción principal que se ejecuta.
- **Entonces** (Then): El resultado esperado.

Además, en este proyecto utilizo `chai` para verificar los resultados con aserciones, y `socket.io-client` para manejar la comunicación en tiempo real entre los jugadores y el servidor.


##  2. Configuracion del entorno

#### Paso 1: Instalar las dependencias

A continuación, debemos instalar las dependencias necesarias. Esto incluye Cucumber para las pruebas, `chai` para las aserciones, y `socket.io-client` para la conexión con el servidor del juego:

Como estoy usando Node.js se puede instalar Cucumber como un módulo de desarrollo usando el siguiente comando:

```bash
npm install --save-dev @cucumber/cucumber chai socket.io-client
```

   - **@cucumber/cucumber**: Es el módulo principal que vamos a usar para escribir y ejecutar pruebas en Gherkin.
   - **chai**: Nos da funciones como `expect` que permiten hacer verificaciones en las pruebas.
   - **socket.io-client**: Permite la comunicación en tiempo real con el servidor que maneja el juego.

#### Paso 2: Estructurar los archivos de prueba

Se creará una estructura de carpetas para organizar los archivos de prueba:

```bash
mkdir features
mkdir features/step_definitions
```

- En la carpeta `features` coloco los archivos `.feature`, donde describo cada escenario de prueba.
- En `features/steps` coloco los archivos `.js` que contienen la lógica de los pasos para cada escenario.

Esa es la estructura del proyecto

```bash
tic-tac-toe
├── CucumberTesting.md
├── features
│   ├── error_handling.feature
│   ├── game_results.feature
│   ├── game_start.feature
│   ├── moves_and_turns.feature
│   ├── no_validation_winner.feature
│   └── steps
│       └── tic-tac-toe.steps.js
```

#### Paso 3: Crear un archivo `.feature`

A continuación, empiezo creando un archivo `.feature` para definir un escenario. Por ejemplo, para `features/game_start.feature` escribo lo siguiente:

```gherkin
Feature: Iniciar el juego de Tic-Tac-Toe

  Scenario: Conexión de dos jugadores
    Given un jugador con el nombre "Ana"
    And otro jugador con el nombre "Mario"
    When ambos jugadores se unan al juego
    Then debería crearse una nueva partida con el tablero vacío
```

Esto describe cómo dos jugadores se conectan al juego y verifica que se inicialize o cree una partida nueva con un tablero vacío.

---
### Nota: Para el proyecto se decidió hacer las pruebas en español.
---
#### Paso 4: Crear un archivo de pasos (step definitions)

Luego, necesito implementar estos pasos en un archivo `.js` en `features/steps`. Creo `features/steps/tic-tac-toe.steps.js` un ejemplo de como implementarlo sería usando:

```javascript
const { Given, When, Then, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { expect } = require('chai'); // Para las aserciones
const io = require('socket.io-client');

let socket;
let response;

// Hook que se ejecuta al inicio para conectar el servidor
BeforeAll(() => {
    socket = io.connect('http://localhost:4000'); // Conectar al servidor del juego
});

// Define el contexto inicial
Given('un jugador con el nombre {string}', function (nombreJugador) {
    socket.emit('find', { name: nombreJugador }); // Envía el nombre del jugador al servidor
});

// Define la acción principal que se va a ejecutar
When('ambos jugadores se unan al juego', function () {
    socket.on('find', (data) => {
        response = data; // Asignar la respuesta
        resolve();
    });
});

// El resultado que se espera
Then('debería crearse una nueva partida con el tablero vacío', function () {
    expect(response).to.exist;
    expect(response.obj.board).to.equal('         '); // Verifica que el tablero esté vacío
});

AfterAll(() => {
    if (socket) {
      socket.disconnect(); // Cerrar la conexión del socket al final de las pruebas
    } 
});
```

- **BeforeAll**: Configuro la conexión al servidor.
- **Given**: Emite un evento para registrar a un jugador por su nombre.
- **When:**  Escucha el evento find desde el servidor obteniendo los datos. 
- **Then**: Verifica que la partida se haya creado con un tablero vacío.
- **AfterAll**: Cierra la conexión de `socket.io` al finalizar todas las pruebas.

#### Paso 5: Ejecutar las pruebas

Para ejecutar las pruebas, simplemente corro el siguiente comando en la terminal:

```bash
npm run cucumber
```

Esto va a ejecutar todos los archivos `.feature` dentro de la carpeta `features`, usando la lógica del archivo en `tic-tac-toe.steps.js`. Con esto, tengo todo lo necesario para que las pruebas se conecten al servidor y validen el comportamiento del juego en tiempo real.

---

## 3. Características y escenarios de pruebas

### Característica: Realización de movimientos
Esta funcionalidad se centra en que los jugadores realizan movimientos en el tablero de Tic-Tac-Toe, asegurando de esta manera que los turnos se alternen y se respeten las reglas del juego.

#### Escenario: Cambiar de turno entre los jugadores

**Descripción**  
Este escenario valida la lógica de cambio de turno en el juego Tic-Tac-Toe. Cuando un jugador realiza un movimiento, el turno debe pasar al otro jugador, y el tablero debe reflejar los movimientos realizados en las posiciones correspondientes.

**Pasos del Escenario**
- **Dado**: 
  - Un jugador con el nombre "Ana".
  - Otro jugador con el nombre "Mario".

- **Cuando**: 
  - "Ana" selecciona "X" en la posición 1.
  - "Mario" selecciona "O" en la posición 2.

- **Entonces**:
  - El tablero debería mostrar "X" en la posición 1.
  - El tablero debería mostrar "O" en la posición 2.
  - Debería ser el turno de "Ana".

**Código de Implementación**

```javascript
Given('un jugador con el nombre {string}', function (nombreJugador) {
    socket.emit('find', { name: nombreJugador });
});

When('{string} selecciona {string} en la posición {int}', function (jugador, marca, posicion) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data;
            socket.emit('playing', { idGame: response.obj.idGame, value: marca, move: `pos${posicion}` });
            resolve();
        });
    });
});

Then('el tablero debería mostrar {string} en la posición {int}', function (marca, posicion) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            const boardPosition = data.objToChange.board.charAt(posicion - 1);
            expect(boardPosition).to.equal(marca);
            resolve();
        });
    });
});
```

---

### Característica: Condiciones de Victoria y Empate

**Descripción General**  
Este comportamiento es esencial para dar cierre a cada partida de acuerdo con las reglas del juego. En esta característica se describen escenarios en los que el juego debe identificar a un ganador o detectar un empate.

#### Escenario: Un jugador gana la partida

**Pasos del Escenario**
- **Dado**:
  - Un jugador llamado "Ana" y un jugador llamado "Mario".

- **Cuando**:
  - "Ana" selecciona "X" en posiciones clave para ganar.

- **Entonces**:
  - "Ana" debería ser el ganador.
  - El juego debería estar terminado.

**Código de Implementación**

```javascript
Then('{string} debería ser el ganador', async function (nombreGanador) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 === 1;
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;
            expect(expectedPlayer).to.equal(nombreGanador);
            resolve();
        });
    });
});
```

---

#### Escenario: El juego termina en empate

**Pasos del Escenario**
- **Dado**: Un jugador llamado "Ana" y un jugador llamado "Mario".
- **Cuando**: Ambos jugadores llenan todas las posiciones sin completar tres en línea.
- **Entonces**: El juego debería estar terminado con un resultado de empate.

**Código de Implementación**

```javascript
Then('el resultado debería ser empate', async function () {
    return new Promise((resolve) => {
        socket.on('gameOver', (data) => {
            expect(data).to.be.an('object');
            expect(data.winner).to.equal('-'); // Un empate se marca con un guion
            resolve();
        });
    });
});
```

---

### Característica: Manejo de Errores

**Descripción General**  
Esta característica asegura que el juego proporcione retroalimentación apropiada cuando un jugador intenta realizar un movimiento fuera de turno o en una posición inválida.

#### Escenario: No es el turno del jugador

**Pasos del Escenario**
- **Dado**: Dos jugadores, "Ana" y "Mario".
- **Cuando**: "Ana" realiza un movimiento, y luego "Mario" intenta realizar dos movimientos seguidos.
- **Entonces**: Mario recibe un mensaje de error indicando que no es su turno.

**Código de Implementación**

```javascript
When('{string} intenta seleccionar {string} en la posición {int}', function (jugador, marca, posicion) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            response = data;
            socket.emit('playing', { idGame: response.obj.idGame, value: marca, move: `pos${posicion}` });
            resolve();
        });
    });
});

Then('debería recibir un mensaje de error {string}', async function (mensaje) {
    return new Promise((resolve) => {
        socket.on('turnError', (response) => {
            expect(response.message).to.equal(mensaje);
            resolve();
        });
    });
});
```

---

#### Escenario: Movimiento inválido

**Pasos del Escenario**
- **Dado**: Dos jugadores, "Ana" y "Mario".
- **Cuando**: "Ana" intenta seleccionar una posición inválida en el tablero (por ejemplo, 10).
- **Entonces**: El juego debería proporcionar un mensaje de error indicando "Movimiento inválido".

**Código de Implementación**

```javascript
When('{string} selecciona "X" en la posición {int}', function (nombreJugador, posicion) {
    return new Promise((resolve) => {
        socket.emit('playing', { move: `pos${posicion}`, value: 'X' });
        resolve();
    });
});

Then('debería recibir un mensaje de error {string}', async function (mensaje) {
    return new Promise((resolve) => {
        socket.on('invalidMove', (response) => {
            expect(response.message).to.equal(mensaje);
            resolve();
        });
    });
});
```

---

### Característica: Validación de No Ganador

**Descripción General**  
Este escenario valida que el juego no declare a un jugador como ganador cuando no se ha cumplido la condición de tres en línea.

#### Escenario: Un jugador no debería ser el ganador

**Pasos del Escenario**
- **Dado**: Un jugador llamado "Ana" y un jugador llamado "Mario".
- **Cuando**: Se realizan movimientos que no completan la condición de victoria.
- **Entonces**: "Mario" no debería ser declarado como ganador.

**Código de Implementación**

```javascript
Then('{string} no debería ser el ganador', async function (nombreGanador) {
    return new Promise((resolve) => {
        socket.on('playing', (data) => {
            const objToChange = data.objToChange;
            const isPlayer1Turn = objToChange.sum % 2 === 1;
            const expectedPlayer = isPlayer1Turn ? objToChange.p1.name : objToChange.p2.name;
            expect(expectedPlayer).to.not.equal(nombreGanador);
            resolve();
        });
    });
});
```

---

## Resultados de las pruebas
```bash
> tic-tac-toe@1.0.0 cucumber
> cucumber-js

..............................................................................................

17 scenarios (17 passed)
94 steps (94 passed)
0m00.260s (executing steps: 0m00.067s)
```

---
## Integrar las pruebas en el pipeline de CI/CD.

Para integrar las pruebas automatizadas con Cucumber en el pipeline debemos de agregara los comandos para instalar las dependencias necesarias y ejecutar los comandos, que a continuación proporcionaré:

```yml
- name: Test Cucumber
      run: npm run cucumber 
      working-directory: tic-tac-toe
```

### Generar reporte al ejecutar las pruebas 

Para ello debemos de agregar los comandos necesarios para que nos genere un reporte en formato JSON:

```yml
- name: Test Cucumber and generate JSON report
    run: npm run cucumber -- --format json:./reports/cucumber-report.json
    working-directory: tic-tac-toe

- name: Run unit tests
    run: npm test
    working-directory: tic-tac-toe

- name: Upload Cucumber report
    uses: actions/upload-artifact@v3
    with:
    name: cucumber-report
    path: tic-tac-toe/reports/cucumber-report.json

```


#### Una vez que se ejecute correctamente el pipeline, nos debemos de dirigir a Actions:   
![alt text](/assets/img1.png)

#### Luego nos dirigimos hacia el flujo de trabajo donde se ejecuto las pruebas y hacemos clic en él:
![alt text](/assets/img3.png)


#### Una vez dentro nos dirigimos hacia la parte inferior y obserbamos que en la sección de **Artifacts** aparece nuestro reporte listo para descargarse.

![alt text](/assets/img2.png)

#### Lo descargamos y observamos nuestro reporte de pruebas


![alt text](/assets/img4.png)
