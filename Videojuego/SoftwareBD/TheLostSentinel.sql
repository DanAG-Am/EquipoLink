CREATE DATABASE TheLostSentinel;
USE TheLostSentinel;

CREATE TABLE Jugador(
	id_jugador INT AUTO_INCREMENT,
    id_cuarto INT,
    usuario VARCHAR(50),
    vida INT,
    stamina INT,
    mana INT,
    moneda INT,
    PRIMARY KEY (id_jugador),
    UNIQUE KEY (usuario),
	PRIMARY KEY (id_jugador),
    FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Cuarto(
	id_cuarto INT AUTO_INCREMENT,
    id_mapa INT,
    npc BOOLEAN, 
    enemigo BOOLEAN, 
    tienda BOOLEAN, 
    reinoHada BOOLEAN, 
    tesoro BOOLEAN,
    jefe BOOLEAN,
    PRIMARY KEY (id_cuarto),
    FOREIGN KEY (id_mapa) REFERENCES Mapa(id_mapa)
);

CREATE TABLE Npc(
	id_npc INT auto_increment,
    id_cuarto INT, 
    nombre VARCHAR(50),
    rol ENUM('viejo','hada'),
    dialogo TEXT,
    PRIMARY KEY (id_npc),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto),
    UNIQUE KEY (nombre)
);

CREATE TABLE Enemigo(
	id_enemigo INT auto_increment,
    id_cuarto INT, 
	nombre VARCHAR(50),
	vida INT,
    dano INT,
    velocidad BOOL, 
    patron TEXT,
    moneda INT,
	PRIMARY KEY (id_enemigo),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto),
    unique KEY (nombre)
);

CREATE TABLE Jefe(
	id_jefe INT auto_increment,
    id_enemigo INT,
    nombre VARCHAR(50),
	vida INT,
    dano INT,
    velocidad BOOL, 
    patron TEXT,
	PRIMARY KEY (id_jefe),
	FOREIGN KEY (id_enemigo) REFERENCES Enemigp(id_enemigo),
    unique KEY (nombre)
);

CREATE TABLE Tienda(
	id_shop INT auto_increment,
    id_npc INT,
    id_cuarto INT,
    PRIMARY KEY (id_shop),
	FOREIGN KEY (id_npc) REFERENCES Npc(id_npc),
	FOREIGN KEY (id_cuarto) REFERENCES Cuarto(id_cuarto)
);

CREATE TABLE Arma(
	id_arma INT, 
    tipo ENUM('espada','arco','bomba'),
    dano INT, 
    rango INT, 
    velocidad FLOAT, 
    durabilidad INT,
    PRIMARY KEY (id_arma)
);

CREATE TABLE Objeto(
	id_objeto INT AUTO_INCREMENT,
    nombre VARCHAR(50),
    tipo ENUM('arma','pocion','moneda'), 
    efecto TEXT,
    stackable BOOLEAN,
    durabilidad INT, 
    precio INT,
    PRIMARY KEY (id_objeto)
);

CREATE TABLE Producto_Tienda(
	id_producto_tienda INT auto_increment,
    id_tienda INT,
    id_objeto INT,
    precio INT,
    cantidad INT,
	PRIMARY KEY (id_producto_tienda),
	FOREIGN KEY (id_tienda) REFERENCES Tienda(id_tienda),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto)
);


CREATE TABLE Inventario(
	id_inventario INT auto_increment,
    id_jugador INT,
    id_objeto INT,
    cantidad INT,
    PRIMARY KEY (id_inventario),
	FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
	FOREIGN KEY (id_objeto) REFERENCES Objeto(id_objeto)
);

CREATE TABLE Mapa(
	id_mapa INT auto_increment,
    nombre VARCHAR(50),
    descripcion TEXT,
    numeroCuartos INT,
    PRIMARY KEY (id_mapa),
    UNIQUE KEY (nombre)
);

