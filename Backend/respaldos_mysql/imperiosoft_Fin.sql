-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:5000
-- Tiempo de generación: 25-06-2023 a las 21:38:03
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `IdCompra` int(11) NOT NULL,
  `FechaCompra` date DEFAULT NULL,
  `TotalCompra` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `IdVentaBarra` int(11) DEFAULT NULL,
  `IdExistencias` int(11) DEFAULT NULL,
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
-- Estructura de tabla para la tabla `existencia`
--

CREATE TABLE `existencia` (
  `IdExistencias` int(11) NOT NULL,
  `IdProductos` int(11) DEFAULT NULL,
  `Stock` int(11) DEFAULT NULL,
  `Cantidad` int(11) DEFAULT NULL,
  `Estado` char(10) DEFAULT NULL,
  `IdDetalleCompra` int(11) DEFAULT NULL,
  `IdCreditos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidoventaenbarra`
--

CREATE TABLE `pedidoventaenbarra` (
  `IdPedidoBarra` int(11) NOT NULL,
  `FechaPedido` date DEFAULT NULL,
  `TotalPedidoBarra` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidoventaenmesa`
--

CREATE TABLE `pedidoventaenmesa` (
  `IdPedidoMesa` int(11) NOT NULL,
  `FechaPedido` date DEFAULT NULL,
  `TotalPedidoMesa` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `Cantidad` int(11) DEFAULT NULL,
  `NombreProducto` varchar(20) DEFAULT NULL,
  `ReferenciaProducto` varchar(15) DEFAULT NULL,
  `FotoProducto` varchar(200) DEFAULT NULL,
  `PrecioProducto` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntodeventaenbarra`
--

CREATE TABLE `puntodeventaenbarra` (
  `IdVentaBarra` int(11) NOT NULL,
  `IdPedidoBarra` int(11) DEFAULT NULL,
  `IdExistencias` int(11) DEFAULT NULL,
  `IdVentaMesas` int(11) DEFAULT NULL,
  `CantidadProducto` varchar(20) DEFAULT NULL,
  `SubTotalAPagar` float DEFAULT NULL,
  `EstadoConfirmarPedido` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntodeventaenmesa`
--

CREATE TABLE `puntodeventaenmesa` (
  `IdVentaMesas` int(11) NOT NULL,
  `IdPedidoMesa` int(11) DEFAULT NULL,
  `IdExistencias` int(11) DEFAULT NULL,
  `CantidadProducto` varchar(20) DEFAULT NULL,
  `SubTotalAPagar` float DEFAULT NULL,
  `EstadoConfirmarPedidoMesa` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'Administrador', 'Activo'),
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
  `Password` varchar(15) DEFAULT NULL,
  `Estado` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`IdUsuarios`, `IdRol`, `Nombre`, `Documento`, `Email`, `Telefono`, `Foto`, `Password`, `Estado`) VALUES
(1, 1, 'tatiana', '123456', 'tatiana@gmail.com', '43562778', 'usuarios-photos/tatiana-tati.jpg', '123456', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `IdVenta` int(11) NOT NULL,
  `IdVentaBarra` int(11) DEFAULT NULL,
  `FechaVenta` date DEFAULT NULL,
  `TotalVenta` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD KEY `IdVentaBarra` (`IdVentaBarra`),
  ADD KEY `IdExistencias` (`IdExistencias`);

--
-- Indices de la tabla `detallecompra`
--
ALTER TABLE `detallecompra`
  ADD PRIMARY KEY (`IdDetalleCompra`),
  ADD KEY `IdCompra` (`IdCompra`),
  ADD KEY `IdExistencias` (`IdExistencias`);

--
-- Indices de la tabla `existencia`
--
ALTER TABLE `existencia`
  ADD PRIMARY KEY (`IdExistencias`),
  ADD KEY `IdProductos` (`IdProductos`),
  ADD KEY `FK_existencia_detallecompra` (`IdDetalleCompra`),
  ADD KEY `FK_existencia_IdCreditos` (`IdCreditos`);

--
-- Indices de la tabla `pedidoventaenbarra`
--
ALTER TABLE `pedidoventaenbarra`
  ADD PRIMARY KEY (`IdPedidoBarra`);

--
-- Indices de la tabla `pedidoventaenmesa`
--
ALTER TABLE `pedidoventaenmesa`
  ADD PRIMARY KEY (`IdPedidoMesa`);

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
-- Indices de la tabla `puntodeventaenbarra`
--
ALTER TABLE `puntodeventaenbarra`
  ADD PRIMARY KEY (`IdVentaBarra`),
  ADD KEY `IdPedidoBarra` (`IdPedidoBarra`),
  ADD KEY `IdExistencias` (`IdExistencias`),
  ADD KEY `IdVentaMesas` (`IdVentaMesas`);

--
-- Indices de la tabla `puntodeventaenmesa`
--
ALTER TABLE `puntodeventaenmesa`
  ADD PRIMARY KEY (`IdVentaMesas`),
  ADD KEY `IdPedidoMesa` (`IdPedidoMesa`),
  ADD KEY `IdExistencias` (`IdExistencias`);

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
  ADD PRIMARY KEY (`IdVenta`),
  ADD KEY `IdVentaBarra` (`IdVentaBarra`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IdCategoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `IdCompra` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT de la tabla `existencia`
--
ALTER TABLE `existencia`
  MODIFY `IdExistencias` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidoventaenbarra`
--
ALTER TABLE `pedidoventaenbarra`
  MODIFY `IdPedidoBarra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidoventaenmesa`
--
ALTER TABLE `pedidoventaenmesa`
  MODIFY `IdPedidoMesa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `IdPermisos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `IdProductos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `IdProveedores` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntodeventaenbarra`
--
ALTER TABLE `puntodeventaenbarra`
  MODIFY `IdVentaBarra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puntodeventaenmesa`
--
ALTER TABLE `puntodeventaenmesa`
  MODIFY `IdVentaMesas` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `IdUsuarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `IdVenta` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `creditos_ibfk_3` FOREIGN KEY (`IdVentaBarra`) REFERENCES `puntodeventaenbarra` (`IdVentaBarra`),
  ADD CONSTRAINT `creditos_ibfk_4` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`);

--
-- Filtros para la tabla `detallecompra`
--
ALTER TABLE `detallecompra`
  ADD CONSTRAINT `detallecompra_ibfk_1` FOREIGN KEY (`IdCompra`) REFERENCES `compra` (`IdCompra`),
  ADD CONSTRAINT `detallecompra_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`);

--
-- Filtros para la tabla `existencia`
--
ALTER TABLE `existencia`
  ADD CONSTRAINT `FK_existencia_IdCreditos` FOREIGN KEY (`IdCreditos`) REFERENCES `creditos` (`IdCreditos`),
  ADD CONSTRAINT `FK_existencia_detallecompra` FOREIGN KEY (`IdDetalleCompra`) REFERENCES `detallecompra` (`IdDetalleCompra`),
  ADD CONSTRAINT `existencia_ibfk_1` FOREIGN KEY (`IdProductos`) REFERENCES `productos` (`IdProductos`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`IdProveedores`) REFERENCES `proveedores` (`IdProveedores`);

--
-- Filtros para la tabla `puntodeventaenbarra`
--
ALTER TABLE `puntodeventaenbarra`
  ADD CONSTRAINT `puntodeventaenbarra_ibfk_1` FOREIGN KEY (`IdPedidoBarra`) REFERENCES `pedidoventaenbarra` (`IdPedidoBarra`),
  ADD CONSTRAINT `puntodeventaenbarra_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`),
  ADD CONSTRAINT `puntodeventaenbarra_ibfk_3` FOREIGN KEY (`IdVentaMesas`) REFERENCES `puntodeventaenmesa` (`IdVentaMesas`);

--
-- Filtros para la tabla `puntodeventaenmesa`
--
ALTER TABLE `puntodeventaenmesa`
  ADD CONSTRAINT `puntodeventaenmesa_ibfk_1` FOREIGN KEY (`IdPedidoMesa`) REFERENCES `pedidoventaenmesa` (`IdPedidoMesa`),
  ADD CONSTRAINT `puntodeventaenmesa_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`IdVentaBarra`) REFERENCES `puntodeventaenbarra` (`IdVentaBarra`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
