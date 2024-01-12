-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:5000
-- Tiempo de generación: 13-11-2023 a las 19:39:57
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `imperiosoft`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `IdCategoria` int(11) NOT NULL,
  `NombreCategoria` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`IdCategoria`, `NombreCategoria`) VALUES
(1, 'Cerveza'),
(2, 'Whisky');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `IdCompra` int(11) NOT NULL,
  `FechaCompra` date DEFAULT NULL,
  `TotalCompra` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`IdCompra`, `FechaCompra`, `TotalCompra`) VALUES
(1, '2023-11-10', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `IdConfiguracion` int(11) NOT NULL,
  `idRol` int(11) DEFAULT NULL,
  `IdPermisos` int(11) DEFAULT NULL,
  `Estado` char(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`IdConfiguracion`, `idRol`, `IdPermisos`, `Estado`) VALUES
(2, 1, 2, 'Activo'),
(3, 1, 29, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `creditos`
--

CREATE TABLE `creditos` (
  `IdCreditos` int(11) NOT NULL,
  `IdUsuarios` int(11) DEFAULT NULL,
  `IdUsuarioCredito` int(11) DEFAULT NULL,
  `IdVenta` int(11) DEFAULT NULL,
  `PrecioCredito` float DEFAULT NULL,
  `FechaCredito` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallecompra`
--

CREATE TABLE `detallecompra` (
  `IdDetalleCompra` int(11) NOT NULL,
  `IdCompra` int(11) DEFAULT NULL,
  `IdExistencias` int(11) DEFAULT NULL,
  `CantidadProductos` int(11) DEFAULT NULL,
  `SubTotalCompra` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallecreditos`
--

CREATE TABLE `detallecreditos` (
  `IdDetalleCreditos` int(11) NOT NULL,
  `IdCreditos` int(11) NOT NULL,
  `FechaAbono` date NOT NULL,
  `PrecioAbono` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleventa`
--

CREATE TABLE `detalleventa` (
  `IdDetalleVenta` int(11) NOT NULL,
  `IdExistencias` int(11) DEFAULT NULL,
  `CantidadProducto` int(20) DEFAULT NULL,
  `SubTotalAPagar` float DEFAULT NULL,
  `IdVenta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalleventa`
--

INSERT INTO `detalleventa` (`IdDetalleVenta`, `IdExistencias`, `CantidadProducto`, `SubTotalAPagar`, `IdVenta`) VALUES
(3, 3, 2, 6000, 3),
(4, 6, 1, 5000, 3),
(5, 6, 1, 5000, 4),
(6, 6, 1, 5000, 5),
(7, 6, 1, 5000, 6),
(8, 6, 1, 5000, 7),
(9, 6, 1, 5000, 8),
(10, 6, 1, 5000, 9),
(11, 6, 1, 5000, 10),
(12, 6, 1, 5000, 11),
(13, 1, 1, 5000, 12),
(14, 1, 1, 5000, 13),
(15, 1, 1, 5000, 14),
(16, 1, 1, 5000, 15),
(17, 1, 1, 5000, 16),
(18, 1, 1, 5000, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `existencia`
--

CREATE TABLE `existencia` (
  `IdExistencias` int(11) NOT NULL,
  `IdProductos` int(11) DEFAULT NULL,
  `Stock` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Estado` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `existencia`
--

INSERT INTO `existencia` (`IdExistencias`, `IdProductos`, `Stock`, `Cantidad`, `Estado`) VALUES
(1, 1, NULL, 24, 'Activo'),
(2, 2, NULL, 30, 'Activo'),
(3, 3, NULL, 8, 'Activo'),
(6, 4, NULL, 1, 'Activo'),
(7, 5, NULL, 10, 'Activo'),
(8, 7, NULL, 10, 'Activo'),
(9, 8, NULL, 20, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oauth`
--

CREATE TABLE `oauth` (
  `IdOAuth` int(11) NOT NULL,
  `expiryDate` datetime NOT NULL,
  `token` varchar(255) NOT NULL,
  `IdUsuarios` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `oauth`
--

INSERT INTO `oauth` (`IdOAuth`, `expiryDate`, `token`, `IdUsuarios`) VALUES
(1, '2023-11-03 22:06:55', '87c01a52-f21a-412f-bd2b-bbd7d2a5373a', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `IdPermisos` int(11) NOT NULL,
  `NombrePermisos` varchar(30) DEFAULT NULL,
  `Modulo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`IdPermisos`, `NombrePermisos`, `Modulo`) VALUES
(2, 'Editar', 'Producto'),
(28, 'Eliminar', 'Producto'),
(29, 'Editar', 'Usuario'),
(30, 'editar', 'Creditos'),
(31, 'Ver ', 'Producto'),
(32, 'Crear', 'Producto'),
(33, 'Ver ', 'Usuario'),
(34, 'Crear', 'Usuario'),
(35, 'Eliminar', 'Usuario'),
(36, 'Ver ', 'Creditos'),
(37, 'Eliminar', 'Creditos'),
(38, 'Crear', 'Creditos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `IdProductos` int(11) NOT NULL,
  `IdCategoria` int(11) DEFAULT NULL,
  `IdProveedores` int(11) DEFAULT NULL,
  `NombreProducto` varchar(20) DEFAULT NULL,
  `ReferenciaProducto` varchar(15) DEFAULT NULL,
  `FotoProducto` varchar(200) DEFAULT NULL,
  `PrecioProducto` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`IdProductos`, `IdCategoria`, `IdProveedores`, `NombreProducto`, `ReferenciaProducto`, `FotoProducto`, `PrecioProducto`) VALUES
(1, 1, 1, 'Budweiser', '269ml', 'img/Cervezas/budweiser.jpg', 5000),
(2, 1, 1, 'Budweiser', '250', 'img/Cervezas/budweiser.jpg', 4000),
(3, 1, 1, 'Budweiser', 'lata', 'img/Cervezas/budweiser.jpg', 3000),
(4, 1, 1, 'Aguila', '269ml', 'img/Cervezas/budweiser.jpg', 5000),
(5, 1, 1, 'Aguila', '250', 'img/Cervezas/budweiser.jpg', 4000),
(6, 1, 1, 'Aguila', 'lata', 'img/Cervezas/budweiser.jpg', 3000),
(7, 2, 1, 'buchanans 12 años', '750ml', 'img/Whiskey/buchanans.jpg', 200000),
(8, 2, 1, 'buchanans 12 años', '1000ml', 'img/Whiskey/buchanans.jpg', 250000),
(9, 2, 1, 'buchanans master', '1000ml', 'img/Whiskey/buchanans.jpg', 200000),
(10, 2, 1, 'buchanans master', '750ml', 'img/Whiskey/buchanans.jpg', 190000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `IdProveedores` int(11) NOT NULL,
  `Nombre` varchar(30) DEFAULT NULL,
  `Documento` varchar(15) DEFAULT NULL,
  `Email` varchar(20) DEFAULT NULL,
  `Direccion` varchar(20) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`IdProveedores`, `Nombre`, `Documento`, `Email`, `Direccion`, `Telefono`) VALUES
(1, 'Bavaria', '5565656', 'bavaria@gmail.com', 'centro', '7787645');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `IdRol` int(11) NOT NULL,
  `NombreRol` varchar(30) DEFAULT NULL,
  `Estado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`IdRol`, `NombreRol`, `Estado`) VALUES
(1, 'Administrador', 'Inactivo'),
(4, 'Supervisor', 'Activo'),
(8, 'Colaborador', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuariocredito`
--

CREATE TABLE `usuariocredito` (
  `IdUsuarioCredito` int(11) NOT NULL,
  `Nombre` varchar(30) DEFAULT NULL,
  `Documento` varchar(15) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `IdUsuarios` int(11) NOT NULL,
  `IdRol` int(11) DEFAULT NULL,
  `Nombre` varchar(30) DEFAULT NULL,
  `Documento` varchar(15) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Foto` varchar(200) DEFAULT NULL,
  `Password` varchar(200) DEFAULT NULL,
  `Estado` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IdUsuarios`, `IdRol`, `Nombre`, `Documento`, `Email`, `Telefono`, `Foto`, `Password`, `Estado`) VALUES
(7, 4, 'angela', '1234876332', 'angela@gmail.com', '9858309333', 'usuarios-photos/angela-tati.jpg', '1234876332', 'Activo'),
(15, 1, 'isa', '50869440', 'isa@gmail.com', '43222', 'usuarios-photos/isa-tati.jpg', 'e5445009ac9aad8da26639b8f7860815e32d0d1daad3fe975697a60838749eb5', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `IdVenta` int(11) NOT NULL,
  `FechaVenta` timestamp NULL DEFAULT current_timestamp(),
  `TotalVenta` float DEFAULT NULL,
  `Estado` varchar(25) DEFAULT NULL,
  `Origen` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`IdVenta`, `FechaVenta`, `TotalVenta`, `Estado`, `Origen`) VALUES
(3, '2023-11-28 16:35:31', 11000, 'vendido', 'Barra'),
(4, '2023-11-02 05:00:00', 5000, 'pendiente', 'Mesa'),
(5, '2023-11-13 16:43:29', 5000, 'pendiente', 'Mesa'),
(6, '2023-11-13 16:46:53', 5000, 'pendiente', 'Mesa'),
(7, '2023-11-13 16:50:07', 5000, 'pendiente', 'Mesa'),
(8, '2023-11-13 16:58:30', 5000, 'pendiente', 'Mesa'),
(9, '2023-11-13 16:58:52', 5000, 'pendiente', 'Mesa'),
(10, '2023-11-13 17:01:26', 5000, 'pendiente', 'Mesa'),
(11, '2023-11-13 17:02:26', 5000, 'pendiente', 'Mesa'),
(12, '2023-11-13 17:31:57', 5000, 'pendiente', 'Mesa'),
(13, '2023-11-13 17:33:01', 5000, 'pendiente', 'Mesa'),
(14, '2023-11-13 17:39:28', 5000, 'pendiente', 'Mesa'),
(15, '2023-11-13 18:15:28', 5000, 'pendiente', 'Mesa'),
(16, '2023-11-13 18:18:58', 5000, 'pendiente', 'Mesa'),
(17, '2023-11-13 18:29:54', 5000, 'pendiente', 'Mesa');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`IdCategoria`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`IdCompra`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`IdConfiguracion`),
  ADD KEY `FK_configuracion_rol` (`idRol`),
  ADD KEY `IdPermisos` (`IdPermisos`);

--
-- Indices de la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD PRIMARY KEY (`IdCreditos`),
  ADD KEY `IdUsuarios` (`IdUsuarios`),
  ADD KEY `IdUsuarioCredito` (`IdUsuarioCredito`),
  ADD KEY `IdVenta` (`IdVenta`);

--
-- Indices de la tabla `detallecompra`
--
ALTER TABLE `detallecompra`
  ADD PRIMARY KEY (`IdDetalleCompra`),
  ADD KEY `IdCompra` (`IdCompra`),
  ADD KEY `IdExistencias` (`IdExistencias`);

--
-- Indices de la tabla `detallecreditos`
--
ALTER TABLE `detallecreditos`
  ADD PRIMARY KEY (`IdDetalleCreditos`),
  ADD KEY `IdCreditos` (`IdCreditos`);

--
-- Indices de la tabla `detalleventa`
--
ALTER TABLE `detalleventa`
  ADD PRIMARY KEY (`IdDetalleVenta`),
  ADD KEY `IdExistencias` (`IdExistencias`),
  ADD KEY `IdVenta` (`IdVenta`);

--
-- Indices de la tabla `existencia`
--
ALTER TABLE `existencia`
  ADD PRIMARY KEY (`IdExistencias`),
  ADD KEY `IdProductos` (`IdProductos`);

--
-- Indices de la tabla `oauth`
--
ALTER TABLE `oauth`
  ADD PRIMARY KEY (`IdOAuth`),
  ADD UNIQUE KEY `UK_5qspx9qei0q7nis7p1bwtt7x` (`token`),
  ADD KEY `FKjio2ngo2rn42e71tmlutn3sw2` (`IdUsuarios`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`IdPermisos`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`IdProductos`),
  ADD KEY `IdCategoria` (`IdCategoria`),
  ADD KEY `IdProveedores` (`IdProveedores`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`IdProveedores`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`IdRol`);

--
-- Indices de la tabla `usuariocredito`
--
ALTER TABLE `usuariocredito`
  ADD PRIMARY KEY (`IdUsuarioCredito`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`IdUsuarios`),
  ADD KEY `IdRol` (`IdRol`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`IdVenta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IdCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `IdCompra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `IdConfiguracion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `creditos`
--
ALTER TABLE `creditos`
  MODIFY `IdCreditos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detallecompra`
--
ALTER TABLE `detallecompra`
  MODIFY `IdDetalleCompra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalleventa`
--
ALTER TABLE `detalleventa`
  MODIFY `IdDetalleVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `existencia`
--
ALTER TABLE `existencia`
  MODIFY `IdExistencias` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `oauth`
--
ALTER TABLE `oauth`
  MODIFY `IdOAuth` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `IdPermisos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `IdProductos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `IdProveedores` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `IdRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuariocredito`
--
ALTER TABLE `usuariocredito`
  MODIFY `IdUsuarioCredito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `IdUsuarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `IdVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD CONSTRAINT `configuracion_ibfk_1` FOREIGN KEY (`IdPermisos`) REFERENCES `permisos` (`IdPermisos`),
  ADD CONSTRAINT `configuracion_ibfk_2` FOREIGN KEY (`idRol`) REFERENCES `rol` (`IdRol`);

--
-- Filtros para la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD CONSTRAINT `creditos_ibfk_1` FOREIGN KEY (`IdUsuarios`) REFERENCES `usuarios` (`IdUsuarios`),
  ADD CONSTRAINT `creditos_ibfk_2` FOREIGN KEY (`IdUsuarioCredito`) REFERENCES `usuariocredito` (`IdUsuarioCredito`),
  ADD CONSTRAINT `creditos_ibfk_3` FOREIGN KEY (`IdVenta`) REFERENCES `venta` (`IdVenta`);

--
-- Filtros para la tabla `detallecompra`
--
ALTER TABLE `detallecompra`
  ADD CONSTRAINT `detallecompra_ibfk_1` FOREIGN KEY (`IdCompra`) REFERENCES `compra` (`IdCompra`),
  ADD CONSTRAINT `detallecompra_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`);

--
-- Filtros para la tabla `detallecreditos`
--
ALTER TABLE `detallecreditos`
  ADD CONSTRAINT `detallecreditos_ibfk_1` FOREIGN KEY (`IdCreditos`) REFERENCES `creditos` (`IdCreditos`);

--
-- Filtros para la tabla `detalleventa`
--
ALTER TABLE `detalleventa`
  ADD CONSTRAINT `detalleventa_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`),
  ADD CONSTRAINT `detalleventa_ibfk_3` FOREIGN KEY (`IdVenta`) REFERENCES `venta` (`IdVenta`);

--
-- Filtros para la tabla `existencia`
--
ALTER TABLE `existencia`
  ADD CONSTRAINT `existencia_ibfk_1` FOREIGN KEY (`IdProductos`) REFERENCES `productos` (`IdProductos`);

--
-- Filtros para la tabla `oauth`
--
ALTER TABLE `oauth`
  ADD CONSTRAINT `FKjio2ngo2rn42e71tmlutn3sw2` FOREIGN KEY (`IdUsuarios`) REFERENCES `usuarios` (`IdUsuarios`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`IdProveedores`) REFERENCES `proveedores` (`IdProveedores`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
