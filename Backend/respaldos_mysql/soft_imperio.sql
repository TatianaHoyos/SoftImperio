-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: soft_imperio
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `IdCategoria` int NOT NULL AUTO_INCREMENT,
  `NombreCategoria` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra`
--

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra` (
  `IdCompra` int NOT NULL AUTO_INCREMENT,
  `FechaCompra` date DEFAULT NULL,
  `TotalCompra` float DEFAULT NULL,
  PRIMARY KEY (`IdCompra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra`
--

LOCK TABLES `compra` WRITE;
/*!40000 ALTER TABLE `compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion`
--

DROP TABLE IF EXISTS `configuracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion` (
  `IdConfiguracion` int NOT NULL AUTO_INCREMENT,
  `IdUsuarios` int DEFAULT NULL,
  `IdPermisos` int DEFAULT NULL,
  `Estado` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdConfiguracion`),
  KEY `FK_configuracion_usuarios` (`IdUsuarios`),
  KEY `IdPermisos` (`IdPermisos`),
  CONSTRAINT `configuracion_ibfk_1` FOREIGN KEY (`IdPermisos`) REFERENCES `permisos` (`IdPermisos`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion`
--

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creditos`
--

DROP TABLE IF EXISTS `creditos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creditos` (
  `IdCreditos` int NOT NULL AUTO_INCREMENT,
  `IdUsuarios` int DEFAULT NULL,
  `IdUsuarioCredito` int DEFAULT NULL,
  `IdVentaBarra` int DEFAULT NULL,
  `IdExistencias` int DEFAULT NULL,
  `PrecioCredito` float DEFAULT NULL,
  `FechaCredito` date DEFAULT NULL,
  PRIMARY KEY (`IdCreditos`),
  KEY `IdUsuarios` (`IdUsuarios`),
  KEY `IdUsuarioCredito` (`IdUsuarioCredito`),
  KEY `IdVentaBarra` (`IdVentaBarra`),
  KEY `IdExistencias` (`IdExistencias`),
  CONSTRAINT `creditos_ibfk_1` FOREIGN KEY (`IdUsuarios`) REFERENCES `usuarios` (`IdUsuarios`),
  CONSTRAINT `creditos_ibfk_2` FOREIGN KEY (`IdUsuarioCredito`) REFERENCES `usuariocredito` (`IdUsuarioCredito`),
  CONSTRAINT `creditos_ibfk_3` FOREIGN KEY (`IdVentaBarra`) REFERENCES `puntodeventaenbarra` (`IdVentaBarra`),
  CONSTRAINT `creditos_ibfk_4` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creditos`
--

LOCK TABLES `creditos` WRITE;
/*!40000 ALTER TABLE `creditos` DISABLE KEYS */;
/*!40000 ALTER TABLE `creditos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallecompra`
--

DROP TABLE IF EXISTS `detallecompra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detallecompra` (
  `IdDetalleCompra` int NOT NULL AUTO_INCREMENT,
  `IdCompra` int DEFAULT NULL,
  `IdExistencias` int DEFAULT NULL,
  `CantidadProductos` int DEFAULT NULL,
  `SubTotalCompra` float DEFAULT NULL,
  PRIMARY KEY (`IdDetalleCompra`),
  KEY `IdCompra` (`IdCompra`),
  KEY `IdExistencias` (`IdExistencias`),
  CONSTRAINT `detallecompra_ibfk_1` FOREIGN KEY (`IdCompra`) REFERENCES `compra` (`IdCompra`),
  CONSTRAINT `detallecompra_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallecompra`
--

LOCK TABLES `detallecompra` WRITE;
/*!40000 ALTER TABLE `detallecompra` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallecompra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `existencia`
--

DROP TABLE IF EXISTS `existencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `existencia` (
  `IdExistencias` int NOT NULL AUTO_INCREMENT,
  `IdProductos` int DEFAULT NULL,
  `Stock` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `Estado` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IdDetalleCompra` int DEFAULT NULL,
  `IdCreditos` int DEFAULT NULL,
  PRIMARY KEY (`IdExistencias`),
  KEY `IdProductos` (`IdProductos`),
  KEY `FK_existencia_detallecompra` (`IdDetalleCompra`),
  KEY `FK_existencia_IdCreditos` (`IdCreditos`),
  CONSTRAINT `existencia_ibfk_1` FOREIGN KEY (`IdProductos`) REFERENCES `productos` (`IdProductos`),
  CONSTRAINT `FK_existencia_detallecompra` FOREIGN KEY (`IdDetalleCompra`) REFERENCES `detallecompra` (`IdDetalleCompra`),
  CONSTRAINT `FK_existencia_IdCreditos` FOREIGN KEY (`IdCreditos`) REFERENCES `creditos` (`IdCreditos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `existencia`
--

LOCK TABLES `existencia` WRITE;
/*!40000 ALTER TABLE `existencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `existencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidoventaenbarra`
--

DROP TABLE IF EXISTS `pedidoventaenbarra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidoventaenbarra` (
  `IdPedidoBarra` int NOT NULL AUTO_INCREMENT,
  `FechaPedido` date DEFAULT NULL,
  `TotalPedidoBarra` float DEFAULT NULL,
  PRIMARY KEY (`IdPedidoBarra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidoventaenbarra`
--

LOCK TABLES `pedidoventaenbarra` WRITE;
/*!40000 ALTER TABLE `pedidoventaenbarra` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidoventaenbarra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidoventaenmesa`
--

DROP TABLE IF EXISTS `pedidoventaenmesa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidoventaenmesa` (
  `IdPedidoMesa` int NOT NULL AUTO_INCREMENT,
  `FechaPedido` date DEFAULT NULL,
  `TotalPedidoMesa` float DEFAULT NULL,
  PRIMARY KEY (`IdPedidoMesa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidoventaenmesa`
--

LOCK TABLES `pedidoventaenmesa` WRITE;
/*!40000 ALTER TABLE `pedidoventaenmesa` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidoventaenmesa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `IdPermisos` int NOT NULL AUTO_INCREMENT,
  `NombrePermisos` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdPermisos`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,'Ver Producto'),(2,'Crear Producto'),(3,'Editar Producto'),(4,'Eliminar Producto'),(5,'Generar reporte existencia'),(6,'Ver  Usuario'),(7,'Crear Usuario'),(8,'Editar Usuario'),(9,'Eliminar Usuario'),(10,'Ver Proveedor'),(11,'Crear Proveedor'),(12,'Editar Proveedor'),(13,'Eliminar Proveedor'),(14,'Ver DasBoard'),(15,'Ver Venta'),(16,'Generar reporte Venta'),(17,'Ver Compra'),(18,'Generar reporte Compra'),(19,'Agregar Compra'),(20,'Ver Credito'),(21,'Crear Credito'),(22,'Editar Credito'),(23,'Eliminar Credito'),(24,'Ver Rol'),(25,'Crear Rol'),(26,'Editar Rol'),(27,'Eliminar Rol');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `IdProductos` int NOT NULL AUTO_INCREMENT,
  `IdCategoria` int DEFAULT NULL,
  `IdProveedores` int DEFAULT NULL,
  `Cantidad` int DEFAULT NULL,
  `NombreProducto` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ReferenciaProducto` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FotoProducto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PrecioProducto` float DEFAULT NULL,
  PRIMARY KEY (`IdProductos`),
  KEY `IdCategoria` (`IdCategoria`),
  KEY `IdProveedores` (`IdProveedores`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`),
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`IdProveedores`) REFERENCES `proveedores` (`IdProveedores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `IdProveedores` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Email` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Direccion` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdProveedores`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntodeventaenbarra`
--

DROP TABLE IF EXISTS `puntodeventaenbarra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntodeventaenbarra` (
  `IdVentaBarra` int NOT NULL AUTO_INCREMENT,
  `IdPedidoBarra` int DEFAULT NULL,
  `IdExistencias` int DEFAULT NULL,
  `IdVentaMesas` int DEFAULT NULL,
  `CantidadProducto` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SubTotalAPagar` float DEFAULT NULL,
  `EstadoConfirmarPedido` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdVentaBarra`),
  KEY `IdPedidoBarra` (`IdPedidoBarra`),
  KEY `IdExistencias` (`IdExistencias`),
  KEY `IdVentaMesas` (`IdVentaMesas`),
  CONSTRAINT `puntodeventaenbarra_ibfk_1` FOREIGN KEY (`IdPedidoBarra`) REFERENCES `pedidoventaenbarra` (`IdPedidoBarra`),
  CONSTRAINT `puntodeventaenbarra_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`),
  CONSTRAINT `puntodeventaenbarra_ibfk_3` FOREIGN KEY (`IdVentaMesas`) REFERENCES `puntodeventaenmesa` (`IdVentaMesas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntodeventaenbarra`
--

LOCK TABLES `puntodeventaenbarra` WRITE;
/*!40000 ALTER TABLE `puntodeventaenbarra` DISABLE KEYS */;
/*!40000 ALTER TABLE `puntodeventaenbarra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntodeventaenmesa`
--

DROP TABLE IF EXISTS `puntodeventaenmesa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntodeventaenmesa` (
  `IdVentaMesas` int NOT NULL AUTO_INCREMENT,
  `IdPedidoMesa` int DEFAULT NULL,
  `IdExistencias` int DEFAULT NULL,
  `CantidadProducto` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `SubTotalAPagar` float DEFAULT NULL,
  `EstadoConfirmarPedidoMesa` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdVentaMesas`),
  KEY `IdPedidoMesa` (`IdPedidoMesa`),
  KEY `IdExistencias` (`IdExistencias`),
  CONSTRAINT `puntodeventaenmesa_ibfk_1` FOREIGN KEY (`IdPedidoMesa`) REFERENCES `pedidoventaenmesa` (`IdPedidoMesa`),
  CONSTRAINT `puntodeventaenmesa_ibfk_2` FOREIGN KEY (`IdExistencias`) REFERENCES `existencia` (`IdExistencias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntodeventaenmesa`
--

LOCK TABLES `puntodeventaenmesa` WRITE;
/*!40000 ALTER TABLE `puntodeventaenmesa` DISABLE KEYS */;
/*!40000 ALTER TABLE `puntodeventaenmesa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `IdRol` int NOT NULL AUTO_INCREMENT,
  `NombreRol` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdRol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'administrador'),(2,'Colaborador'),(3,'Prueva');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuariocredito`
--

DROP TABLE IF EXISTS `usuariocredito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuariocredito` (
  `IdUsuarioCredito` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdUsuarioCredito`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuariocredito`
--

LOCK TABLES `usuariocredito` WRITE;
/*!40000 ALTER TABLE `usuariocredito` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuariocredito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `IdUsuarios` int NOT NULL AUTO_INCREMENT,
  `IdRol` int DEFAULT NULL,
  `Nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Documento` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Email` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Foto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Password` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Estado` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`IdUsuarios`),
  KEY `IdRol` (`IdRol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IdRol`) REFERENCES `rol` (`IdRol`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`IdUsuarios`) REFERENCES `configuracion` (`IdUsuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `IdVenta` int NOT NULL AUTO_INCREMENT,
  `IdVentaBarra` int DEFAULT NULL,
  `FechaVenta` date DEFAULT NULL,
  `TotalVenta` float DEFAULT NULL,
  PRIMARY KEY (`IdVenta`),
  KEY `IdVentaBarra` (`IdVentaBarra`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`IdVentaBarra`) REFERENCES `puntodeventaenbarra` (`IdVentaBarra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-15 21:59:29
