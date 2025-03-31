USE TheLostSentinel;

-- 1. Mapa
INSERT INTO Mapa (nombre, descripcion, tamano_x, tamano_y)
VALUES ('Calabozo', 'Un oscuro calabozo lleno de misterios y desafíos', 50, 50);

-- 2. Cuarto (11 cuartos según el orden especificado)
-- Sala 1: con NPC
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 1: Encuentro con un NPC', 'con_npc', FALSE);
-- Salas 2, 3 y 4: con enemigo
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 2: Zona con enemigos', 'con_enemigo', FALSE);
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 3: Pasillo de enemigos', 'con_enemigo', FALSE);
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 4: Habitación de combate', 'con_enemigo', FALSE);
-- Sala 5: con NPC
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 5: Encuentro con un NPC', 'con_npc', FALSE);
-- Salas 6, 7 y 8: con enemigo
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 6: Área infestada de enemigos', 'con_enemigo', FALSE);
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 7: Corredor de combate', 'con_enemigo', FALSE);
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 8: Zona hostil', 'con_enemigo', FALSE);
-- Sala 9: con NPC
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 9: Encuentro con un NPC', 'con_npc', FALSE);
-- Sala 10: con enemigo
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 10: Confrontación con enemigos', 'con_enemigo', FALSE);
-- Sala 11: con jefe (acceso bloqueado)
INSERT INTO Cuarto (id_mapa, descripcion, tipo, acceso_bloqueado)
VALUES (1, 'Sala 11: Cámara del jefe', 'con_jefe', TRUE);

-- 3. NPC (en las salas que tienen NPC: 1, 5 y 9)
INSERT INTO NPC (id_cuarto, nombre, role, dialogo)
VALUES (1, 'Guardián Sabio', 'viejo', 'Bienvenido, aventurero.');
INSERT INTO NPC (id_cuarto, nombre, role, dialogo)
VALUES (5, 'Hada Mística', 'hada', 'La magia te guía.');
INSERT INTO NPC (id_cuarto, nombre, role, dialogo)
VALUES (9, 'Mercader Errante', 'mercantil', 'Compra o vende, tu destino es incierto.');

-- 4. Enemigo (en las salas con enemigos: 2, 3, 4, 6, 7, 8 y 10)
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (2, 'Enemigo_A', 40, 40, 8, 6, 3);
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (3, 'Enemigo_B', 45, 45, 7, 7, 4);
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (4, 'Enemigo_C', 50, 50, 6, 8, 5);
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (6, 'Enemigo_D', 35, 35, 9, 5, 2);
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (7, 'Enemigo_E', 55, 55, 5, 10, 6);
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (8, 'Enemigo_F', 60, 60, 4, 12, 7);
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (10, 'Enemigo_G', 50, 50, 6, 8, 5);

-- 5. Enemigo para el jefe (en sala 11)
INSERT INTO Enemigo (id_cuarto, nombre, vida_max, vida_actual, velocidad, dano, drop_monedas)
VALUES (11, 'Enemigo_Boss', 150, 150, 3, 20, 15);

-- 6. Jefe (referenciando al enemigo anterior en sala 11)
INSERT INTO Jefe (id_enemigo, id_cuarto, nombre, vida, dano, velocidad)
VALUES ((SELECT id_enemigo FROM Enemigo WHERE nombre = 'Enemigo_Boss'), 11, 'Señor del Calabozo', 200, 25, 2);

-- 7. Jugador (asignados a distintos cuartos)
INSERT INTO Jugador (id_cuarto, usuario, contrasena, hp_actual, hp_max, mp_actual, mp_max, monedas, pociones, bombas, flechas)
VALUES (1, 'Hero1', 'pass1', 80, 100, 50, 100, 30, 2, 1, 10);
INSERT INTO Jugador (id_cuarto, usuario, contrasena, hp_actual, hp_max, mp_actual, mp_max, monedas, pociones, bombas, flechas)
VALUES (2, 'Hero2', 'pass2', 90, 100, 60, 100, 45, 3, 0, 15);

-- 8. Estadísticas para cada jugador
INSERT INTO Estadisticas (id_jugador, enemigos_derrotados, cofres_abiertos, objetos_usados, muertes, tiempo_jugado)
VALUES (1, 5, 2, 3, 0, '01:30:00');
INSERT INTO Estadisticas (id_jugador, enemigos_derrotados, cofres_abiertos, objetos_usados, muertes, tiempo_jugado)
VALUES (2, 8, 3, 4, 1, '02:15:00');

-- 9. Objetos (diferentes tipos)
INSERT INTO Objeto (nombre, tipo, efecto, stackable, precio)
VALUES ('Bomba Pequeña', 'bomba', 'Explosión de corto alcance', FALSE, 50);
INSERT INTO Objeto (nombre, tipo, efecto, stackable, precio)
VALUES ('Flecha de Hielo', 'flecha', 'Ralentiza al enemigo', TRUE, 10);
INSERT INTO Objeto (nombre, tipo, efecto, stackable, precio)
VALUES ('Poción de Vida', 'pocion', 'Recupera 20 HP', TRUE, 15);
INSERT INTO Objeto (nombre, tipo, efecto, stackable, precio)
VALUES ('Moneda de Oro', 'moneda', 'Moneda de cambio', TRUE, 1);

-- 10. Arma (usando objetos existentes)
INSERT INTO Arma (id_arma, tipo, daño, radio_explosion, alcance, consumo_mp)
VALUES (1, 'bomba', 30, 2, 0, 0);
INSERT INTO Arma (id_arma, tipo, daño, radio_explosion, alcance, consumo_mp)
VALUES (2, 'arco', 15, 0, 50, 5);

-- 11. Inventario (asociado a los jugadores)
INSERT INTO Inventario (id_jugador, id_objeto, cantidad)
VALUES (1, 3, 5);
INSERT INTO Inventario (id_jugador, id_objeto, cantidad)
VALUES (1, 4, 20);
INSERT INTO Inventario (id_jugador, id_objeto, cantidad)
VALUES (2, 2, 15);

-- 12. Cofre (en algunas salas)
INSERT INTO Cofre (id_cuarto, id_objeto, enemigos_derrotados, abierto)
VALUES (3, 3, FALSE, FALSE);
INSERT INTO Cofre (id_cuarto, id_objeto, enemigos_derrotados, abierto)
VALUES (10, 4, TRUE, TRUE);

-- 13. Contenido_Cofre (para el primer cofre)
INSERT INTO Contenido_Cofre (id_cofre, id_objeto, cantidad)
VALUES (1, 3, 2);

-- 14. Tienda (asociada a un NPC; se utiliza el NPC de la sala 1)
INSERT INTO Tienda (id_npc, tipo)
VALUES (1, 'pociones');

-- 15. Producto_Tienda (para la tienda anterior)
INSERT INTO Producto_Tienda (id_tienda, id_objeto, precio, cantidad, stock_infinito)
VALUES (1, 3, 20, 10, FALSE);

-- 16. Elemento_Cuarto (registrando el elemento presente en cada cuarto)
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (1, 'npc');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (2, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (3, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (4, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (5, 'npc');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (6, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (7, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (8, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (9, 'npc');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (10, 'enemigo');
INSERT INTO Elemento_Cuarto (id_cuarto, tipo) VALUES (11, 'jefe');

-- 17. Accion (acciones disponibles)
INSERT INTO Accion (nombre, descripcion)
VALUES ('atacar_espada', 'Ataque cuerpo a cuerpo con espada.');
INSERT INTO Accion (nombre, descripcion)
VALUES ('disparar_flecha', 'Ataque a distancia con arco.');
INSERT INTO Accion (nombre, descripcion)
VALUES ('dejar_bomba', 'Colocar una bomba para explotar en área.');

-- 18. Jugador_Accion (registro de acciones de los jugadores)
INSERT INTO Jugador_Accion (id_jugador, id_accion, id_objeto, id_enemigo, id_npc, descripcion)
VALUES (1, 1, 1, 1, NULL, 'Ataque de espada exitoso contra Enemigo_A.');
INSERT INTO Jugador_Accion (id_jugador, id_accion, id_objeto, id_enemigo, id_npc, descripcion)
VALUES (2, 2, 2, 2, 1, 'Disparo de flecha certero.');

SELECT * FROM Mapa;
SELECT * FROM Cuarto;
SELECT * FROM Jugador;
SELECT * FROM Estadisticas;
SELECT * FROM Objeto;
SELECT * FROM Arma;
SELECT * FROM Inventario;
SELECT * FROM Cofre;
SELECT * FROM Contenido_Cofre;
SELECT * FROM NPC;
SELECT * FROM Tienda;
SELECT * FROM Producto_Tienda;
SELECT * FROM Elemento_Cuarto;
SELECT * FROM Enemigo;
SELECT * FROM Jefe;
SELECT * FROM Accion;
SELECT * FROM Jugador_Accion;