# 📝 Registro de Decisiones - Ramtun

## Decisión #001 - Configuración Inicial del Venture
**Fecha**: 2024-12-19  
**Responsable**: Jorge Daniel Salgado  
**Contexto**: Configuración inicial del proyecto Ramtun con Atlas  

### Decisión Tomada
- **Modo de Trabajo**: Asistido (Wizard) para guía paso a paso
- **Gestión de Estado**: Con Repositorio Git para automatización
- **Herramienta Principal**: Augment Code en Visual Studio Code

### Justificación
El modo asistido permite un desarrollo más estructurado y educativo, mientras que Git automatiza el versionado y trazabilidad de decisiones.

### Impacto
- Estructura de Venture Playbook inicializada
- Framework AAGD activado
- Documentación automática habilitada

---

## Decisión #002 - Definición del Concepto Core
**Fecha**: 2024-12-19  
**Responsable**: Jorge Daniel Salgado  
**Contexto**: Definición inicial del concepto Ramtun  

### Decisión Tomada
**Ramtun**: Plataforma educativa de crucigramas con IA para profesores y estudiantes de educación básica y media.

### Componentes Clave
- **Usuario Primario**: Profesores (creadores)
- **Usuario Final**: Estudiantes (jugadores)
- **Tecnología Core**: IA generativa para crucigramas
- **Plataformas**: Móvil + PC

### Justificación
Aborda dolor real de engagement en aulas mediante gamificación educativa escalable.

---

## Decisión #003 - Segmentación de Clientes Definida
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Definición específica del mercado objetivo chileno

### Decisión Tomada
**Segmento Geográfico**: Chile completo
**Segmento Educativo**:
- Educación Básica (1° a 8° básico)
- Educación Media (1° a 4° medio)
- Escuelas públicas y privadas
- Todas las materias (Ciencias, Historia, Matemáticas, Lenguaje, etc.)

### Justificación
Mercado total direccionable claro y bien definido, con sistema educativo estandarizado que facilita la penetración.

### Impacto
- TAM calculable y específico
- Estrategia de go-to-market enfocada
- Desarrollo de producto localizado

---

## Decisión #004 - Modelo de Monetización Híbrido
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Estrategia de ingresos multi-stream

### Decisión Tomada
**Modelo Híbrido Combinado**:
1. Freemium (adquisición)
2. Suscripción Individual B2C
3. Licencias Institucionales B2B
4. Marketplace Premium B2B2C

### Justificación
Maximiza oportunidades de revenue, reduce dependencia de un solo stream, permite escalabilidad gradual.

### Impacto
- Múltiples fuentes de ingresos
- Flexibilidad de pricing por segmento
- Complejidad operacional inicial

---

## Decisión #005 - Canal Principal: Redes Sociales
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Estrategia de adquisición de usuarios

### Decisión Tomada
**Canal Principal**: Redes sociales educativas
**Canales Específicos**: LinkedIn, Facebook, Instagram, TikTok, YouTube

### Justificación
Profesores chilenos activos en redes sociales, costo de adquisición bajo, escalabilidad viral.

### Impacto
- CAC optimizado
- Estrategia de contenido requerida
- Community building como ventaja competitiva

---

## Decisión #006 - Prompt-Zero: Contrato de Intención IA
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Definición del "cerebro" de la IA educativa de Ramtun

### Decisión Tomada
**Prompt-Zero Completo** con especificaciones:
- **Flujo de Generación**: Tema → Análisis contextual → Inferencia de materia → Generación adaptada
- **Cantidad por Dificultad**: Fácil (8-12), Media (10-20), Difícil (15-25) preguntas
- **Validación Docente**: Profesor puede editar, agregar, quitar antes de aprobar
- **Ejemplo Validado**: "Revolución Francesa, 8° Básico, Dificultad Media"

### Componentes Clave
1. **Identidad IA**: Ramtun AI especializada en educación chilena
2. **Contexto Curricular**: Alineación estricta con MINEDUC
3. **Adaptabilidad Cognitiva**: Contenido apropiado por nivel
4. **Criterios de Calidad**: Métricas específicas de éxito
5. **Proceso de Revisión**: Interfaz de edición para profesores

### Justificación
El Prompt-Zero es el artefacto más crítico que garantiza que la IA genere contenido educativo de calidad, alineado con el curriculum chileno y apropiado para cada nivel cognitivo.

### Impacto
- **Calidad Garantizada**: Estándares educativos claros
- **Escalabilidad**: Proceso replicable para cualquier tema
- **Control Docente**: Profesor mantiene autoridad editorial
- **Diferenciación**: Especialización en sistema educativo chileno

---

## Decisión #007 - Stack Tecnológico: Innovación Visual
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Selección de tecnologías para máximo impacto visual

### Decisión Tomada
**Stack Completo**:
- **Frontend**: Next.js 14 + Tailwind CSS + Framer Motion + Three.js
- **Backend**: Supabase (PostgreSQL + Vector + Auth + Edge Functions)
- **IA**: OpenAI GPT-4 + Embeddings
- **Deployment**: Vercel + Supabase Cloud
- **Plataforma**: Web App Responsive (móvil + PC)

### Justificación
Combinación que maximiza innovación visual, performance y developer experience con Augment Code. Stack moderno que permite interfaces únicas y persuasivas.

### Impacto
- **Diferenciación Visual**: Crucigramas 3D únicos en mercado
- **Performance Premium**: Experiencia fluida en todos dispositivos
- **Escalabilidad**: Arquitectura que crece con el negocio
- **Desarrollo Ágil**: Stack optimizado para prototipado rápido

---

## Decisión #008 - Arquitectura de Componentes UX
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Diseño de wireframes y flujos de usuario

### Decisión Tomada
**4 Componentes Principales**:
1. **Sistema de Autenticación**: OAuth social + Magic links
2. **Dashboard Profesores**: Métricas + Generador rápido + Biblioteca
3. **Editor Visual**: Drag & drop + Auto-layout + Preview tiempo real
4. **App Juego Estudiantes**: Gamificación + Colaborativo + Celebración

### Justificación
Flujos optimizados para cada tipo de usuario, priorizando simplicidad para profesores y engagement para estudiantes.

### Impacto
- **UX Diferenciada**: Cada rol tiene experiencia optimizada
- **Adopción Rápida**: Interfaces intuitivas reducen fricción
- **Engagement Alto**: Gamificación mantiene atención estudiantil
- **Escalabilidad**: Componentes modulares y reutilizables

---

## Decisión #009 - Corrección de Proceso Git en PowerShell
**Fecha**: 2024-12-19
**Responsable**: Atlas (Sistema)
**Contexto**: Error en commits por incompatibilidad PowerShell vs Bash

### Problema Identificado
Los commits estaban fallando debido al uso del operador `&&` (bash) en PowerShell de Windows, causando error: "El token '&&' no es un separador de instrucciones válido".

### Decisión Tomada
**Proceso Corregido**:
- Usar comandos Git separados en lugar de concatenados
- `git add .` seguido de `git commit -m "mensaje"` en comandos independientes
- Validar éxito de cada comando antes de proceder

### Justificación
PowerShell de Windows no soporta el operador `&&` de bash. Comandos separados garantizan compatibilidad y mejor control de errores.

### Impacto
- **Historial Git**: Recuperado correctamente con 3 commits válidos
- **Trazabilidad**: Documentación de cambios preservada
- **Proceso**: Atlas adaptado para entorno Windows PowerShell

---

## Decisión #010 - Repositorio GitHub Configurado
**Fecha**: 2024-12-19
**Responsable**: Jorge Daniel Salgado
**Contexto**: Configuración de repositorio remoto para Venture Playbook

### Decisión Tomada
**Repositorio GitHub**: https://github.com/Loveless2k/ai-ramtun-app
- Remote origin configurado correctamente
- Push inicial exitoso con 4 commits históricos
- Venture Playbook completo disponible en la nube

### Justificación
Repositorio remoto garantiza backup automático, versionado robusto, colaboración futura y integración DevOps para el desarrollo del MVP.

### Impacto
- **Backup Seguro**: Venture Playbook protegido en GitHub
- **Colaboración**: Preparado para equipo de desarrollo
- **Trazabilidad**: Historial completo de decisiones Atlas
- **DevOps Ready**: Base para CI/CD en Fase 2

### Contenido Subido
- README.md con estado del proyecto
- docs/lean-canvas.md (Fase 0)
- docs/risk-ledger.md (Fase 0)
- docs/prompt-zero.md (Fase 1)
- docs/technical-architecture.md (Fase 1)
- docs/decision-log.md (10 decisiones)
- docs/executive-log.md (2 sesiones)

---

*Última actualización: 2024-12-19*
