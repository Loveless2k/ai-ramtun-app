# 🏗️ Arquitectura Técnica - Ramtun

**Versión**: v1.0  
**Fecha**: 2024-12-19  
**Responsable**: Jorge Daniel Salgado  
**Enfoque**: Innovación Visual + Experiencia Premium  

---

## 🎯 **FILOSOFÍA ARQUITECTÓNICA**

### **Principios de Diseño**
1. **Visual First**: Cada componente diseñado para máximo impacto visual
2. **Performance Premium**: Experiencia fluida en todos los dispositivos
3. **Escalabilidad Inteligente**: Arquitectura que crece con el negocio
4. **Developer Experience**: Stack optimizado para Augment Code + VS Code

### **Objetivos de Experiencia**
- **Profesores**: Dashboard intuitivo y poderoso que inspire confianza
- **Estudiantes**: Juego inmersivo que haga el aprendizaje adictivo
- **Administradores**: Analytics en tiempo real con visualizaciones impactantes

---

## 🚀 **STACK TECNOLÓGICO**

### **Frontend - Experiencia Visual Premium**

#### **Next.js 14 + App Router**
```typescript
// Estructura del proyecto
ramtun-app/
├── app/                    # App Router (Next.js 14)
│   ├── (auth)/            # Rutas de autenticación
│   ├── dashboard/         # Dashboard profesores
│   ├── game/              # Interfaz estudiantes
│   ├── editor/            # Editor visual crucigramas
│   └── api/               # API routes
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
└── public/                # Assets estáticos
```

**¿Por qué Next.js 14?**
- **App Router**: Routing moderno con layouts anidados
- **Server Components**: Performance superior
- **Streaming**: Carga progresiva para UX premium
- **Built-in Optimizations**: Imágenes, fonts, scripts automáticamente optimizados

#### **Tailwind CSS + Headless UI**
```css
/* Tema personalizado Ramtun */
module.exports = {
  theme: {
    extend: {
      colors: {
        ramtun: {
          primary: '#6366F1',    // Índigo vibrante
          secondary: '#EC4899',  // Rosa energético
          accent: '#10B981',     // Verde éxito
          dark: '#1F2937',       // Gris oscuro elegante
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      }
    }
  }
}
```

**¿Por qué Tailwind + Headless UI?**
- **Diseño Único**: Control total sobre la apariencia
- **Componentes Accesibles**: Headless UI garantiza accesibilidad
- **Desarrollo Rápido**: Utility-first para prototipado veloz
- **Consistencia**: Design system escalable

#### **Framer Motion + Lottie**
```typescript
// Animaciones micro-interacciones
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'

const CrosswordCard = () => (
  <motion.div
    whileHover={{ scale: 1.05, rotateY: 5 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-br from-ramtun-primary to-ramtun-secondary"
  >
    <Lottie animationData={puzzleAnimation} />
  </motion.div>
)
```

**¿Por qué Framer Motion + Lottie?**
- **Micro-interacciones**: Cada click, hover, transición es memorable
- **Animaciones Complejas**: Lottie para animaciones de diseñadores
- **Performance**: Animaciones optimizadas para 60fps
- **Engagement**: Gamificación visual que mantiene atención

#### **Three.js + React Three Fiber**
```typescript
// Crucigrama 3D interactivo
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D } from '@react-three/drei'

const Crossword3D = () => (
  <Canvas>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <Text3D font="/fonts/helvetiker_regular.typeface.json">
      REVOLUCIÓN
    </Text3D>
    <OrbitControls enableZoom={false} />
  </Canvas>
)
```

**¿Por qué Three.js?**
- **Diferenciación Visual**: Crucigramas 3D únicos en el mercado
- **Inmersión**: Experiencia de juego más envolvente
- **Wow Factor**: Impacto visual que genera viralidad
- **Futuro-proof**: Preparado para VR/AR

---

## 🗄️ **BACKEND - SUPABASE ECOSYSTEM**

### **Supabase como Backend-as-a-Service**

#### **Base de Datos PostgreSQL + Vector**
```sql
-- Esquema principal
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT CHECK (role IN ('teacher', 'student', 'admin')),
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crosswords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  level TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions JSONB NOT NULL,
  teacher_id UUID REFERENCES profiles(id),
  embedding VECTOR(1536), -- OpenAI embeddings
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice vectorial para búsqueda semántica
CREATE INDEX ON crosswords USING ivfflat (embedding vector_cosine_ops);
```

#### **Supabase Auth + RLS**
```sql
-- Row Level Security para multi-tenancy
ALTER TABLE crosswords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can CRUD their crosswords" ON crosswords
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can read school crosswords" ON crosswords
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND school_id = (
        SELECT school_id FROM profiles WHERE id = crosswords.teacher_id
      )
    )
  );
```

#### **Edge Functions para IA**
```typescript
// supabase/functions/generate-crossword/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { topic, level, difficulty } = await req.json()
  
  // Llamada a OpenAI GPT-4
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: RAMTUN_PROMPT_ZERO },
        { role: 'user', content: `Tema: ${topic}, Nivel: ${level}, Dificultad: ${difficulty}` }
      ]
    })
  })
  
  const crosswordData = await openaiResponse.json()
  
  // Generar embedding para búsqueda
  const embedding = await generateEmbedding(topic)
  
  return new Response(JSON.stringify({ 
    crossword: crosswordData,
    embedding 
  }))
})
```

---

## 🎮 **COMPONENTES DE APLICACIÓN**

### **1. Sistema de Autenticación**
```typescript
// lib/auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useAuth = () => {
  const supabase = createClientComponentClient()
  
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }
  
  return { signInWithGoogle, user, loading }
}
```

**Características:**
- **OAuth Social**: Google, Microsoft (integración escolar)
- **Magic Links**: Email sin contraseña
- **Multi-tenant**: Separación por escuela automática
- **Roles**: Profesor, Estudiante, Admin

### **2. Dashboard Profesores**
```typescript
// app/dashboard/page.tsx
export default function TeacherDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Métricas en tiempo real */}
      <MetricsCards />
      
      {/* Crucigramas recientes */}
      <RecentCrosswords />
      
      {/* Analytics de estudiantes */}
      <StudentEngagement />
      
      {/* Generador rápido */}
      <QuickGenerator />
    </div>
  )
}
```

**Funcionalidades:**
- **Vista General**: Métricas de engagement estudiantil
- **Biblioteca**: Crucigramas creados y compartidos
- **Analytics**: Performance por tema y estudiante
- **Generador Rápido**: Crear crucigrama en 30 segundos

### **3. Editor Visual de Crucigramas**
```typescript
// components/CrosswordEditor.tsx
import { DndContext, DragOverlay } from '@dnd-kit/core'

export const CrosswordEditor = () => {
  return (
    <div className="flex h-screen">
      {/* Panel de preguntas */}
      <QuestionsPanel />
      
      {/* Grid interactivo */}
      <DndContext onDragEnd={handleDragEnd}>
        <CrosswordGrid />
        <DragOverlay>
          <WordTile />
        </DragOverlay>
      </DndContext>
      
      {/* Propiedades */}
      <PropertiesPanel />
    </div>
  )
}
```

**Características:**
- **Drag & Drop**: Arrastar palabras al grid
- **Auto-layout**: IA sugiere mejor disposición
- **Preview en Tiempo Real**: Ver como estudiante
- **Validación**: Verificar que crucigrama es resoluble

### **4. App de Juego Estudiantes**
```typescript
// app/game/[id]/page.tsx
export default function CrosswordGame({ params }: { params: { id: string } }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600"
    >
      {/* Header con progreso */}
      <GameHeader />
      
      {/* Crucigrama interactivo */}
      <InteractiveCrossword />
      
      {/* Pistas y ayudas */}
      <CluesPanel />
      
      {/* Celebración de logros */}
      <AchievementToast />
    </motion.div>
  )
}
```

**Experiencia de Juego:**
- **Gamificación**: Puntos, logros, streaks
- **Colaborativo**: Múltiples estudiantes en tiempo real
- **Adaptativo**: Pistas dinámicas según dificultad
- **Celebración**: Animaciones de éxito memorable

---

## 📊 **INTEGRACIONES Y APIS**

### **OpenAI GPT-4 Integration**
```typescript
// lib/openai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateCrossword = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: RAMTUN_PROMPT_ZERO },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })
  
  return JSON.parse(completion.choices[0].message.content)
}
```

### **Vector Search para Contenido**
```typescript
// lib/vector-search.ts
export const findSimilarCrosswords = async (topic: string) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: topic,
  })
  
  const { data } = await supabase.rpc('match_crosswords', {
    query_embedding: embedding.data[0].embedding,
    match_threshold: 0.8,
    match_count: 10
  })
  
  return data
}
```

---

## 🚀 **DEPLOYMENT Y DEVOPS**

### **Vercel + Supabase**
```yaml
# vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### **Monitoreo y Analytics**
- **Vercel Analytics**: Performance y Core Web Vitals
- **Supabase Analytics**: Queries y usage
- **PostHog**: Product analytics y feature flags
- **Sentry**: Error tracking y performance monitoring

## 📱 **WIREFRAMES Y FLUJOS UX**

### **Flujo Principal: Profesor Crea Crucigrama**

```
[Login] → [Dashboard] → [Nuevo Crucigrama] → [Generación IA] → [Editor] → [Publicar]
   ↓         ↓              ↓                    ↓            ↓         ↓
Auth     Métricas      Input tema         Preview        Editar    Compartir
Social   + Biblioteca  + Nivel           + Sugerencias   Visual    con clase
```

### **Flujo Principal: Estudiante Juega**

```
[Acceso] → [Selección] → [Juego] → [Progreso] → [Completado] → [Celebración]
   ↓          ↓           ↓         ↓            ↓              ↓
Código     Lista de    Crucigrama  Tiempo +     Puntuación    Logros +
de clase   crucigramas interactivo Pistas      + Ranking     Compartir
```

### **Componentes UI Clave**

#### **Dashboard Profesor - Layout**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Ramtun          [Notificaciones] [Perfil] ▼     │
├─────────────────────────────────────────────────────────┤
│ 📊 Métricas Rápidas                                    │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│ │ 24  │ │ 89% │ │ 156 │ │ 4.8 │                      │
│ │Cruci│ │Compl│ │Estud│ │★★★★ │                      │
│ └─────┘ └─────┘ └─────┘ └─────┘                      │
│                                                         │
│ 🎯 Generador Rápido        📚 Biblioteca Reciente     │
│ ┌─────────────────────┐    ┌─────────────────────┐    │
│ │ Tema: [_________]   │    │ • Revolución Francesa │    │
│ │ Nivel: [8° Básico▼] │    │ • Ecosistemas        │    │
│ │ [Generar Ahora] 🚀  │    │ • Fracciones         │    │
│ └─────────────────────┘    └─────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

#### **Editor Visual - Layout**
```
┌─────────────────────────────────────────────────────────┐
│ ← Volver | Revolución Francesa - 8° Básico | [Guardar] │
├─────────────────────────────────────────────────────────┤
│ 📝 Preguntas (18)     │ 🎯 Crucigrama        │ ⚙️ Props │
│ ┌─────────────────┐   │ ┌─────────────────┐  │ ┌──────┐ │
│ │ 1. Rey ejecutado│   │ │ L U I S   X V I │  │ │Tamaño│ │
│ │    en 1793      │   │ │ O   │   │   │   │  │ │15x15 │ │
│ │ [LUIS XVI] ✏️   │   │ │ B   │   │   │   │  │ │      │ │
│ │                 │   │ │ E   │   │   │   │  │ │Tema  │ │
│ │ 2. Fortaleza    │   │ │ S   │   │   │   │  │ │Oscuro│ │
│ │    tomada 1789  │   │ │ P   │   │   │   │  │ │      │ │
│ │ [BASTILLA] ✏️   │   │ │ I   │   │   │   │  │ │Ayudas│ │
│ │                 │   │ │ E   │   │   │   │  │ │ ON   │ │
│ │ + Agregar       │   │ │ R   │   │   │   │  │ └──────┘ │
│ └─────────────────┘   │ │ R   │   │   │   │  │          │
│                       │ │ E   │   │   │   │  │          │
│ [Vista Previa] 👁️     │ └─────────────────┘  │          │
└─────────────────────────────────────────────────────────┘
```

#### **Juego Estudiante - Layout**
```
┌─────────────────────────────────────────────────────────┐
│ 🎮 Revolución Francesa    ⏱️ 12:34    🏆 1,250 pts    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│     🎯 CRUCIGRAMA INTERACTIVO                          │
│     ┌─────────────────────────────────┐                │
│     │ [L][U][I][S][ ][X][V][I]       │ ← Animado      │
│     │ [ ][O][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][B][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][E][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][S][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][P][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][I][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][E][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][R][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][R][ ][ ][ ][ ][ ][ ]       │                │
│     │ [ ][E][ ][ ][ ][ ][ ][ ]       │                │
│     └─────────────────────────────────┘                │
│                                                         │
│ 💡 PISTAS ACTIVAS                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Horizontal 1: Rey de Francia ejecutado en 1793     │ │
│ │ Vertical 2: Líder conocido como "El Incorruptible" │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ [💡 Pista] [🔄 Reiniciar] [✅ Verificar] [🏃 Rendirse] │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 **DESIGN SYSTEM**

### **Paleta de Colores**
```css
:root {
  /* Primarios */
  --ramtun-primary: #6366F1;      /* Índigo confianza */
  --ramtun-secondary: #EC4899;    /* Rosa energía */
  --ramtun-accent: #10B981;       /* Verde éxito */

  /* Neutros */
  --ramtun-dark: #1F2937;         /* Gris elegante */
  --ramtun-light: #F9FAFB;        /* Blanco suave */
  --ramtun-gray: #6B7280;         /* Gris medio */

  /* Estados */
  --ramtun-success: #059669;      /* Verde confirmación */
  --ramtun-warning: #D97706;      /* Naranja alerta */
  --ramtun-error: #DC2626;        /* Rojo error */
}
```

### **Tipografía**
```css
/* Headings - Inter (moderna, legible) */
h1, h2, h3 { font-family: 'Inter', sans-serif; }

/* Body - System fonts (performance) */
body { font-family: system-ui, -apple-system, sans-serif; }

/* Monospace - JetBrains Mono (código) */
code, pre { font-family: 'JetBrains Mono', monospace; }
```

### **Animaciones Signature**
```css
/* Hover cards */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-hover:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
}

/* Loading states */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; box-shadow: 0 0 20px var(--ramtun-primary); }
  50% { opacity: 0.8; box-shadow: 0 0 40px var(--ramtun-primary); }
}
```

---

*Última actualización: 2024-12-19*
*Próxima revisión: 2025-01-19*
