# 🎯 Ramtun - Plataforma Educativa con IA

**Sistema de Crucigramas Inteligentes para Educación Chilena**

## 📊 Estado del Proyecto
- **Fase Actual**: MVP Funcional - Desarrollo Activo
- **Versión**: v2.0
- **Última Actualización**: 2025-06-09
- **Director del Proyecto**: Jorge Daniel Salgado
- **Repositorio**: https://github.com/Loveless2k/ai-ramtun-app
- **Demo Local**: http://localhost:3000

## 🎮 Visión del Proyecto
**Ramtun** es una plataforma educativa que transforma el aprendizaje tradicional en experiencias gamificadas mediante crucigramas generados por IA, diseñada específicamente para profesores de educación básica y media en Chile.

## 📁 Estructura del Proyecto

```
ai-ramtun-app/                    ← Repositorio principal
├── docs/                         ← Documentación del proyecto
│   ├── lean-canvas.md           ← Modelo de negocio
│   ├── prompt-zero.md           ← Especificaciones de IA
│   ├── technical-architecture.md ← Arquitectura técnica
│   └── ...
├── resources/                    ← Recursos multimedia
│   └── video/                   ← Videos demostrativos
├── ramtun-web/                  ← 🚀 APLICACIÓN PRINCIPAL
│   ├── src/                     ← Código fuente
│   │   ├── app/                 ← Rutas Next.js App Router
│   │   ├── components/          ← Componentes React
│   │   ├── lib/                 ← Utilidades y configuración
│   │   └── utils/               ← Funciones auxiliares
│   ├── package.json             ← Dependencias del proyecto
│   ├── next.config.ts           ← Configuración Next.js
│   └── tailwind.config.ts       ← Configuración Tailwind
└── README.md                    ← Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Git

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/Loveless2k/ai-ramtun-app.git
cd ai-ramtun-app

# 2. Ir a la aplicación principal
cd ramtun-web

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload

# Producción
npm run build        # Construir para producción
npm run start        # Ejecutar build de producción

# Calidad de código
npm run lint         # Verificar código con ESLint
```

## 🎯 Funcionalidades Principales

### ✅ Implementado y Funcionando
- **🎮 Aplicación de Estudiantes**: Interfaz completa para jugar crucigramas
- **👨‍🏫 Dashboard de Profesores**: Panel de control con gestión de crucigramas
- **🤖 Generador de IA**: Integración OpenAI GPT-4 para crear crucigramas automáticamente
- **🧩 Algoritmo Perfecto**: Generación matemáticamente correcta de crucigramas
- **🔐 Sistema de Autenticación**: Login/registro con Supabase y protección de rutas
- **📱 Diseño Responsivo**: Interfaz adaptable a móviles, tablets y desktop
- **⚡ Performance Optimizada**: Solución híbrida para input focus sin pérdida de rendimiento

### 🎨 Stack Tecnológico
- **Frontend**: Next.js 15.3.3 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Backend**: Supabase (Auth + Database)
- **IA**: OpenAI GPT-4 API
- **Deployment**: Vercel (recomendado)

### 🗂️ Rutas Principales
- `/` - Página de inicio con demo
- `/auth/login` - Autenticación de usuarios
- `/auth/register` - Registro de nuevos usuarios
- `/game` - Selección de crucigramas (demo público)
- `/game/[id]` - Juego de crucigrama específico
- `/student` - Dashboard de estudiantes
- `/dashboard` - Dashboard de profesores
- `/generator` - Generador de crucigramas con IA

## 📚 Documentación

### 📋 Documentos de Proyecto
- [📊 Lean Canvas](./docs/lean-canvas.md) - Modelo de negocio
- [⚠️ Risk Ledger](./docs/risk-ledger.md) - Análisis de riesgos
- [🎯 Prompt-Zero](./docs/prompt-zero.md) - Especificaciones de IA
- [🏗️ Arquitectura Técnica](./docs/technical-architecture.md) - Diseño del sistema
- [📝 Registro de Decisiones](./docs/decision-log.md) - Historial de decisiones
- [📊 Bitácora Ejecutiva](./docs/executive-log.md) - Progreso del proyecto

### 🔧 Documentación Técnica
- [🎯 Solución Input Focus](./ramtun-web/docs/SOLUCION_INPUT_FOCUS.md) - Optimización de performance
- [🔗 Configuración Supabase](./ramtun-web/docs/SUPABASE_SETUP.md) - Setup de base de datos

## 🤝 Contribución

### Flujo de Desarrollo
1. **Fork** del repositorio
2. **Crear rama** para nueva funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** en `ramtun-web/` (aplicación principal)
4. **Commit** con mensajes descriptivos
5. **Push** y crear **Pull Request**

### Estándares de Código
- **TypeScript** obligatorio para nuevos archivos
- **ESLint** para calidad de código
- **Tailwind CSS** para estilos (no CSS custom)
- **Componentes reutilizables** en `src/components/`

## 📞 Contacto y Soporte

- **Desarrollador Principal**: Jorge Daniel Salgado
- **Repositorio**: [GitHub](https://github.com/Loveless2k/ai-ramtun-app)
- **Issues**: [GitHub Issues](https://github.com/Loveless2k/ai-ramtun-app/issues)

---

## ⚠️ Notas Importantes

### Estructura de Carpetas
- **IMPORTANTE**: Todos los comandos npm deben ejecutarse desde `ramtun-web/`
- **NO** ejecutar comandos npm desde la carpeta raíz `ai-ramtun-app/`
- La aplicación principal está en `ramtun-web/src/`

### Variables de Entorno
Crear archivo `.env.local` en `ramtun-web/`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
OPENAI_API_KEY=tu_key_openai
```

---
*Desarrollado con ❤️ para la educación chilena*
