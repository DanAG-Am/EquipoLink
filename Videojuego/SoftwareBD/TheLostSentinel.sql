CREATE DATABASE TheLostSentinel;
USE TheLostSentinel;

CREATE TABLE Mapa(
	id_mapa INT AUTO_INCREMENT,
	nombre VARCHAR(50),
	descripcion TEXT,
	tamano_x INT,
	tamano_y INT,
	PRIMARY KEY (id_mapa),
	UNIQUE KEY (nombre)
);

CREATE TABLE Cuarto(
	id_cuarto INT AUTO_INCREMENT,
	id_mapa INT,
	descripcion TEXT,
	tipo ENUM('normal','con_npc','con_enemigo','tienda','reino_hada','tesoro','con_jefe'),
	acceso_bloqueado BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id_cuarto),
	FOREIGN KEY (id_mapa) REFERENCES Mapa(id_mapa)
);

CREATE TABLE Jugador(
	id_jugador INT AUTO_INCREMENT,
	id_cuarto INT,
	usuario VARCHAR(50),
	contrasena VARCHAR(50),
	hp_actual INT CHECK (hp_actual BETWEEN 0 AND 100),
	hp_max INT DEFAULT 100,
	mp_actual INT CHECK (mp_actual BETWEEN 0 AND 100),
	mp_max INT DEFAULT 100,
	monedas INT CHECK (monedas >= 0),
	pociones INT CHECK (pociones >= 0),
	bombas INT CHECK (bombas >= 0),
	flechas INT CHECK (flechas >= 0),
	PRIMARY KEY (id_jugador),
	UNIQUE KEY (usuario),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Objeto(
	id_objeto INT AUTO_INCREMENT,
	nombre VARCHAR(50),
	tipo ENUM('bomba','tech','pocion','moneda'),
	efecto TEXT,
	stackable BOOLEAN,
	precio INT,
	PRIMARY KEY (id_objeto)
);

CREATE TABLE Arma(
	id_arma INT AUTO_INCREMENT,
	tipo ENUM('espada','arco','barrita_magica','bomba'),
	daño INT CHECK (daño >= 0),
	radio_explosion INT,
	alcance INT,
	consumo_mp INT,
	PRIMARY KEY (id_arma),
	FOREIGN KEY (id_arma) REFERENCES Objeto(id_objeto)
);

CREATE TABLE Inventario(
	id_inventario INT AUTO_INCREMENT,
	id_jugador INT,
	id_objeto INT,
	cantidad INT CHECK (cantidad >= 0),
	PRIMARY KEY (id_inventario),
	FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto)
);

CREATE TABLE Cofre(
	id_cofre INT AUTO_INCREMENT,
	id_cuarto INT,
	id_objeto INT,
	requiere_llave BOOLEAN DEFAULT TRUE,
	abierto BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id_cofre),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto)
);

CREATE TABLE Contenido_Cofre(
	id_contenido INT AUTO_INCREMENT,
	id_cofre INT,
	id_objeto INT,
	cantidad INT CHECK (cantidad >= 0),
	PRIMARY KEY (id_contenido),
	FOREIGN KEY (id_cofre) REFERENCES Cofre(id_cofre),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto)
);

CREATE TABLE NPC(
	id_npc INT AUTO_INCREMENT,
	id_cuarto INT,
	nombre VARCHAR(50),
	role ENUM('viejo','hada','mercantil'),
	dialogo TEXT,
	activo BOOLEAN,
	intercambiable BOOLEAN,
	PRIMARY KEY (id_npc),

	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Tienda(
	id_shop INT AUTO_INCREMENT,
	id_npc INT,
	PRIMARY KEY (id_shop),
	FOREIGN KEY (id_npc) REFERENCES NPC(id_npc)
);

CREATE TABLE Producto_Tienda(
	id_producto_tienda INT AUTO_INCREMENT,
	id_shop INT,
	id_objeto INT,
	precio INT CHECK (precio >= 0),
	cantidad INT CHECK (cantidad >= 0),
	stock_infinito BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id_producto_tienda),
	FOREIGN KEY (id_shop) REFERENCES Tienda(id_shop),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto)
);

CREATE TABLE Elemento_Cuarto(
	id_elemento INT AUTO_INCREMENT,
	id_cuarto INT,
	tipo ENUM('npc','enemigo','tesoro','jefe'),
	PRIMARY KEY (id_elemento),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Enemigo(
	id_enemigo INT AUTO_INCREMENT,
	id_cuarto INT,
	nombre VARCHAR(50),
	vida_max INT,
	vida_actual INT,
	velocidad INT,
	daño INT,
	drop_monedas INT,
	PRIMARY KEY (id_enemigo),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Jefe(
	id_jefe INT AUTO_INCREMENT,
	id_enemigo INT,
	id_cuarto INT,
	nombre VARCHAR(50),
	vida INT,
	daño INT,
	velocidad INT,
	PRIMARY KEY (id_jefe),
	FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Accion(
	id_accion INT AUTO_INCREMENT,
	nombre ENUM('atacar_espada','disparar_flecha','dejar_bomba'),
	descripcion TEXT,
	PRIMARY KEY (id_accion)
);

CREATE TABLE Jugador_Accion(
	id_jugador_accion INT AUTO_INCREMENT,
	id_jugador INT,
	id_accion INT,
	id_objeto INT,
	id_enemigo INT,
	id_npc INT,
	fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id_jugador_accion),
	FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
	FOREIGN KEY (id_accion) REFERENCES Accion(id_accion),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto),
	FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo),
	FOREIGN KEY (id_npc) REFERENCES NPC(id_npc)
);