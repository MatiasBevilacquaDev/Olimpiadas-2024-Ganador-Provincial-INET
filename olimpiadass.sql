-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 15-11-2024 a las 18:56:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `olimpiadass`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` varchar(255) NOT NULL,
  `productos` text NOT NULL,
  `id_usuario` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `productos`, `id_usuario`, `direccion`, `total`) VALUES
('2mzow83vm2orcxwe', '2mzowcv0m01osl8w', '4', 'casa', 5.00),
('2mzow83vm2orxx5a', '2mzowcv0m01osbar,2mzow83vm2orkznm', '2', 'MOUSE PRUEBA', 675.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidosentregados`
--

CREATE TABLE `pedidosentregados` (
  `id_pedido` int(11) NOT NULL,
  `productos` text DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidosentregados`
--

INSERT INTO `pedidosentregados` (`id_pedido`, `productos`, `id_usuario`, `direccion`, `total`, `fecha`) VALUES
(2, '2mzowcv0m01osxqu', 3, 'Avenida mitre 900', 50.00, '2024-08-19 21:35:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`) VALUES
('2mzow83vm2orkznm', 'mouse', 'es un mouse para la compu', 525.00),
('2mzowcv0m01osbar', 'Zapatillas nike', 'son para correr rapido', 150.00),
('2mzowcv0m01osl8w', 'Pelotas de tenis', 'Son para jugar al tenis muy bien', 5.00),
('2mzowcv0m01osxqu', 'Raqueta de padel', 'Muy buena, excelente durabilidad', 50.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_usuario` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(5) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_usuario`, `correo`, `username`, `nombre`, `apellido`, `password`, `rol`) VALUES
(2, 'administradorTienda@gmail.com', 'Admin', 'Admin', 'Admin', '$2a$08$MmhhMV2Hj/.O78udBxyor.wIcpXj4RQnjUhAiTM85neTRSSdrBJfS', 'admin'),
(3, 'usuario@usuario.com', 'Juan2024', 'Juan', 'Perez', '$2a$08$CDzn0l2o/9vgNEvIMwoVsOZubKAqDPdPpqipArGsASlo4CNtfkyZC', 'user'),
(4, 'prueba@prueba.com', 'prueba1', 'prueba', 'pruebaRamirez', '$2a$08$1eg4iMM84IAG8x2T45WYDe7xyXj1RwB20GHbWf85OXxyALL6Owv.a', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`);

--
-- Indices de la tabla `pedidosentregados`
--
ALTER TABLE `pedidosentregados`
  ADD PRIMARY KEY (`id_pedido`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
