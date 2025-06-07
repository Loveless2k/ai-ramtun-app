# ⚠️ Risk Ledger - Ramtun

**Versión**: v1.0  
**Fecha**: 2024-12-19  
**Responsable**: Jorge Daniel Salgado  

---

## 🎯 **METODOLOGÍA DE EVALUACIÓN**

### Escala de Probabilidad
- **1-Muy Baja** (0-20%): Improbable que ocurra
- **2-Baja** (21-40%): Posible pero poco probable
- **3-Media** (41-60%): Probabilidad moderada
- **4-Alta** (61-80%): Probable que ocurra
- **5-Muy Alta** (81-100%): Casi certeza

### Escala de Impacto
- **1-Mínimo**: Retraso <1 mes, <$100K CLP
- **2-Menor**: Retraso 1-3 meses, $100K-500K CLP
- **3-Moderado**: Retraso 3-6 meses, $500K-2M CLP
- **4-Mayor**: Retraso 6-12 meses, $2M-10M CLP
- **5-Crítico**: Retraso >12 meses, >$10M CLP o cierre

### Matriz de Riesgo
**Score = Probabilidad × Impacto**
- **1-4**: Riesgo Bajo (Verde)
- **5-12**: Riesgo Medio (Amarillo)
- **13-20**: Riesgo Alto (Naranja)
- **21-25**: Riesgo Crítico (Rojo)

---

## 🚨 **RIESGOS CRÍTICOS (Score 21-25)**

### R001 - Calidad de IA Generativa Insuficiente
**Probabilidad**: 4 | **Impacto**: 5 | **Score**: 20
**Descripción**: La IA no genera crucigramas educativamente válidos o coherentes
**Consecuencias**: 
- Pérdida de confianza de profesores
- Abandono masivo de usuarios
- Daño reputacional irreversible

**Mitigaciones**:
- [ ] **Inmediata**: Prototipo con GPT-4 + validación manual
- [ ] **Corto Plazo**: Dataset de entrenamiento con curriculum chileno
- [ ] **Mediano Plazo**: Fine-tuning de modelo especializado
- [ ] **Contingencia**: Sistema híbrido IA + templates pre-validados

**Responsable**: CTO  
**Fecha Límite**: 2025-01-31  
**Estado**: 🔴 Pendiente

---

## ⚠️ **RIESGOS ALTOS (Score 13-20)**

### R002 - Resistencia al Cambio Docente
**Probabilidad**: 4 | **Impacto**: 4 | **Score**: 16
**Descripción**: Profesores tradicionales rechazan herramientas digitales
**Consecuencias**: Adopción lenta, CAC alto, modelo B2B fallido

**Mitigaciones**:
- [ ] **Investigación**: Entrevistas con 50 profesores (validación)
- [ ] **UX**: Interfaz extremadamente simple e intuitiva
- [ ] **Capacitación**: Webinars y tutoriales paso a paso
- [ ] **Champions**: Programa de profesores embajadores

**Responsable**: Head of Education  
**Fecha Límite**: 2025-02-28  
**Estado**: 🟡 En Progreso

### R003 - Competencia de Gigantes Tecnológicos
**Probabilidad**: 3 | **Impacto**: 5 | **Score**: 15
**Descripción**: Google, Microsoft o Meta lanzan producto similar
**Consecuencias**: Pérdida de market share, guerra de precios

**Mitigaciones**:
- [ ] **Diferenciación**: Especialización en curriculum chileno
- [ ] **Velocidad**: Time-to-market agresivo (6 meses MVP)
- [ ] **Partnerships**: Alianzas exclusivas con editoriales
- [ ] **IP**: Patentes de algoritmos educativos específicos

**Responsable**: CEO  
**Fecha Límite**: 2025-06-30  
**Estado**: 🔴 Pendiente

### R004 - Regulaciones de Protección de Datos Menores
**Probabilidad**: 3 | **Impacto**: 4 | **Score**: 12
**Descripción**: Ley de protección de datos de menores bloquea funcionalidades
**Consecuencias**: Rediseño de producto, retrasos, costos legales

**Mitigaciones**:
- [ ] **Legal**: Consultoría especializada en EdTech y menores
- [ ] **Arquitectura**: Privacy by design desde día 1
- [ ] **Compliance**: Certificaciones COPPA, GDPR-K
- [ ] **Transparencia**: Políticas claras para padres/escuelas

**Responsable**: Legal Counsel  
**Fecha Límite**: 2025-03-31  
**Estado**: 🔴 Pendiente

---

## 🟡 **RIESGOS MEDIOS (Score 5-12)**

### R005 - Dependencia de APIs Externas de IA
**Probabilidad**: 3 | **Impacto**: 3 | **Score**: 9
**Descripción**: OpenAI/Anthropic cambian precios o términos de servicio
**Consecuencias**: Aumento de costos, interrupción de servicio

**Mitigaciones**:
- [ ] **Diversificación**: Múltiples proveedores de IA
- [ ] **Contratos**: SLAs y pricing protegido por 12 meses
- [ ] **Contingencia**: Modelo local como backup
- [ ] **Optimización**: Caching inteligente para reducir calls

**Responsable**: CTO  
**Fecha Límite**: 2025-04-30  
**Estado**: 🟡 En Progreso

### R006 - Modelo de Monetización Complejo
**Probabilidad**: 4 | **Impacto**: 2 | **Score**: 8
**Descripción**: Múltiples streams confunden a usuarios y complican operaciones
**Consecuencias**: Conversión baja, churn alto, complejidad operacional

**Mitigaciones**:
- [ ] **Simplificación**: Lanzar solo con Freemium + Individual
- [ ] **Testing**: A/B test de pricing y packaging
- [ ] **Comunicación**: Messaging claro por segmento
- [ ] **Iteración**: Agregar streams gradualmente

**Responsable**: Head of Growth  
**Fecha Límite**: 2025-02-15  
**Estado**: 🟡 En Progreso

### R007 - Escalabilidad Técnica
**Probabilidad**: 2 | **Impacto**: 4 | **Score**: 8
**Descripción**: Arquitectura no soporta crecimiento exponencial de usuarios
**Consecuencias**: Downtime, experiencia degradada, pérdida de usuarios

**Mitigaciones**:
- [ ] **Arquitectura**: Microservicios desde MVP
- [ ] **Cloud**: Auto-scaling en AWS/GCP
- [ ] **Monitoring**: Alertas proactivas de performance
- [ ] **Load Testing**: Simulación de 10K usuarios concurrentes

**Responsable**: CTO  
**Fecha Límite**: 2025-05-31  
**Estado**: 🔴 Pendiente

---

## 🟢 **RIESGOS BAJOS (Score 1-4)**

### R008 - Cambios en Curriculum Nacional
**Probabilidad**: 2 | **Impacto**: 2 | **Score**: 4
**Descripción**: Ministerio de Educación modifica contenidos curriculares
**Consecuencias**: Actualización de base de datos, reentrenamiento de IA

**Mitigaciones**:
- [ ] **Monitoreo**: Suscripción a boletines ministeriales
- [ ] **Flexibilidad**: Sistema de tags y categorías adaptable
- [ ] **Partnerships**: Relación directa con Ministerio
- [ ] **Versionado**: Control de versiones de contenido

**Responsable**: Head of Education  
**Fecha Límite**: Continuo  
**Estado**: 🟢 Bajo Control

---

## 📊 **DASHBOARD DE RIESGOS**

### Por Categoría
- **Tecnológicos**: 4 riesgos (R001, R005, R007, R008)
- **Mercado**: 2 riesgos (R002, R003)
- **Regulatorios**: 1 riesgo (R004)
- **Negocio**: 1 riesgo (R006)

### Por Prioridad
- **🔴 Críticos**: 1 riesgo
- **🟠 Altos**: 3 riesgos
- **🟡 Medios**: 3 riesgos
- **🟢 Bajos**: 1 riesgo

### Próximas Acciones (30 días)
1. **R001**: Prototipo de IA educativa
2. **R002**: Entrevistas con profesores
3. **R004**: Consultoría legal especializada
4. **R006**: Simplificación de modelo de pricing

---

## 🔄 **PROCESO DE REVISIÓN**

### Frecuencia
- **Semanal**: Riesgos críticos y altos
- **Quincenal**: Riesgos medios
- **Mensual**: Riesgos bajos + nuevos riesgos
- **Trimestral**: Revisión completa de metodología

### Responsabilidades
- **CEO**: Aprobación de mitigaciones críticas
- **CTO**: Riesgos tecnológicos
- **Head of Education**: Riesgos pedagógicos
- **Legal**: Riesgos regulatorios
- **CFO**: Riesgos financieros

### Escalación
- **Score >15**: Notificación inmediata a CEO
- **Score >20**: Reunión de crisis en 24h
- **Materialización**: Plan de contingencia activado

---

*Última actualización: 2024-12-19*  
*Próxima revisión: 2024-12-26*
