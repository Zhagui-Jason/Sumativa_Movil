# SmartReview

## Problema
Muchos estudiantes olvidan los temas que han estudiado porque no tienen una organización adecuada de sus repasos y suelen volver a estudiar únicamente cuando se acercan las evaluaciones.

## Solución
SmartReview ayudará a los estudiantes a organizar sus materias y temas de estudio mediante tarjetas de preguntas y respuestas. Además, permitirá evaluar cuánto recuerdan y programará automáticamente las fechas de los próximos repasos, facilitando el refuerzo de los conocimientos.

## Objetivos
- 1. Desarrollar una aplicación móvil que permita registrar, almacenar y consultar al menos 3 materias y 15 temas de estudio, conservando los datos después de cerrar y volver a abrir la aplicación.
- 2. Implementar un sistema de tarjetas que permita crear al menos 5 preguntas por tema y mostrar su respuesta al pulsar un botón, comprobando su funcionamiento con 15 tarjetas de prueba.
- 3. Incorporar tres opciones de evaluación del recuerdo: «No lo recordé», «Lo recordé parcialmente» y «Lo recordé», asignando intervalos de 0, 1 y 3 días, respectivamente.
- 4. Mostrar las fechas de los próximos repasos en una lista, verificando mediante 9 casos de prueba (3 por cada nivel de recuerdo) que las fechas mostradas coincidan exactamente con las fechas calculadas a partir de la fecha de evaluación.
- 5. Comprobar que las funciones principales de registro, creación de tarjetas y programación de repasos puedan utilizarse sin conexión a Internet en un dispositivo Android.

## Habilidades
- Programación móvil con React Native y TypeScript.
- Diseño y desarrollo de interfaces utilizando Expo.
- Almacenamiento local de información.
- Implementación de algoritmos básicos para calcular fechas de repaso.
- Organización y trabajo colaborativo en equipo.

## Tecnologías
- React Native con Expo SDK 58 y TypeScript.
- Expo Router con navegación Stack y rutas simples.
- NativeWind para estilos y temas claro/oscuro.
- AsyncStorage para conservar materias, temas y preferencias en el dispositivo.

## Alcance inicial
Registro y visualización de materias y temas.

Creación, edición y eliminación de tarjetas de preguntas y respuestas.

Sistema para mostrar las preguntas y comprobar las respuestas.

Evaluación del recuerdo con intervalos de 0, 1 y 3 días.

Programación local de la próxima fecha de repaso de cada tarjeta.

Lista de tarjetas pendientes y próximas fechas de repaso.



## Restricciones
- La aplicación estará diseñada inicialmente para dispositivos Android.
- Funcionará sin necesidad de conexión a Internet.
- Los datos se almacenarán localmente en el dispositivo.
- No incluirá inteligencia artificial ni sincronización en la nube.
- La primera versión utilizará un algoritmo sencillo de repetición espaciada.
- No tendrá funciones de colaboración entre diferentes usuarios.
