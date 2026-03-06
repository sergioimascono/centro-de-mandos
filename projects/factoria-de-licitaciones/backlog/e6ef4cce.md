---
id: e6ef4cce
title: Mejorar Sistema de Análisis de Pliego
description: "-\tPrimero tenemos que mirar como podemos hacer que el análisis inicial sea mas preciso y funcione con agentes\n\no\tTenemos un proceso de análisis en local con Claude Code que funciona bastante bien con agentes pero con el tema de la api nos ocurre que se queda colgado y no funciona correctamente\no\tPara ello antes de empezar seria crear una nueva rama con estos cambios\no\tHacer para cada documento un postprocesado que lo convertimos a MD, y creamos una pagina de MD por pagina del documento y luego creamos un índice que explique que habla cada pagina. \no\tLuego los agentes deben detectar partes del pliego interesante por ejemplo tener varios agente que miren todos los documentos mds de forma orquestada y que cada vez que encunetren un Stopper, creen un Bloque que pasen al orquestador que sería con un formato “Causa del Stopper, Texto sin resumir y 100% exacto al pliego, numero de pagina donde aparece” de esta manera creamos algo similar a LLM Notebook \no\tDa igual que el análisis tarde mucho la idea es que sea exhaustivo y lanzemos agentes por cada parte del análisis para no olvidarnos nada \no\tPor ello creo que la parte de subida de pliegos deberíamos tener la opción de Postprocesar los pliegos y hacer esto\no\tOtra opción estudiar el tema de Sonnet con Contexto de 1 Millon de tokens\no\tOtra opción si no utilizar Api de Notebook \no\tOtra opción seria procesar el análisis desde Claude code local pero no es lo que buscamos."
priority: critical
tags:
  - mejoras
  - limitaciones
created: '2026-03-06T21:47:29.491Z'
updated: '2026-03-06T21:47:29.491Z'
---

