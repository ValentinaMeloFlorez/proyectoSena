# CONTAIA PRO — Diagramas de Flujo Detallados

Complemento visual del documento de diseño completo.

---

## 1. Flujo de Autenticación y Acceso a Módulos

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend
    participant A as Auth Controller
    participant S as Auth Service
    participant DB as PostgreSQL

    U->>F: Ingresa email + password
    F->>A: POST /api/v1/auth/login
    A->>S: authenticate(credentials)
    S->>DB: Buscar usuario + verificar hash
    DB-->>S: Usuario + Rol + Permisos
    S-->>A: JWT + Refresh Token
    A-->>F: { access_token, refresh_token, user }
    F->>F: Guardar tokens en authStore
    F->>F: Cargar menú según permisos
    F-->>U: Redirigir a Dashboard

    Note over F,A: Requests posteriores
    F->>A: GET /api/v1/clients (Authorization: Bearer)
    A->>A: Validar JWT + permiso clients:read
    A->>DB: Query filtrado por company_id
    DB-->>F: Lista de clientes
```

---

## 2. Flujo de Creación de Factura (Cross-Módulo)

```mermaid
sequenceDiagram
    actor V as Vendedor
    participant F as Frontend
    participant IC as Invoice Controller
    participant IS as Invoice Service
    participant CS as Client Service
    participant PS as Product Service
    participant InvS as Inventory Service
    participant IncS as Income Service
    participant DB as PostgreSQL

    V->>F: Nueva factura
    F->>F: Seleccionar cliente (módulo Clientes)
    F->>F: Agregar líneas de producto (módulo Productos)

    V->>F: Confirmar factura
    F->>IC: POST /api/v1/invoices
    IC->>IS: create_invoice(data)

    IS->>CS: validate_client_exists(client_id)
    CS->>DB: SELECT client
    DB-->>CS: Cliente válido

    loop Por cada línea
        IS->>PS: get_product(product_id)
        PS-->>IS: Producto + precio
        IS->>InvS: check_stock(product_id, qty)
        InvS-->>IS: Stock disponible
    end

    IS->>IS: Calcular totales e impuestos
    IS->>DB: INSERT invoice + items
    IS->>InvS: register_exit(items)
    InvS->>DB: INSERT inventory_movements

    IS->>IncS: create_pending_income(invoice)
    IncS->>DB: INSERT income

    IS-->>IC: InvoiceResponse
    IC-->>F: 201 Created
    F-->>V: Factura FAC-0001 generada
```

---

## 3. Flujo de Datos hacia Reportes y Dashboard

```mermaid
flowchart TB
    subgraph Fuentes
        INV[Facturas]
        INC[Ingresos]
        EXP[Egresos]
        STK[Movimientos Inventario]
    end

    subgraph Agregación
        RS[Report Service]
        DS[Dashboard Service]
    end

    subgraph Salida
        RP[Páginas de Reportes]
        DH[Dashboard KPIs]
        AI[AI Service]
    end

    INV --> RS
    INC --> RS
    EXP --> RS
    STK --> RS

    INV --> DS
    INC --> DS
    EXP --> DS
    STK --> DS

    RS --> RP
    RS --> AI
    DS --> DH
    AI --> DH
```

---

## 4. Flujo de Permisos en Frontend

```mermaid
flowchart TD
    R[Request de ruta] --> PR{ProtectedRoute}
    PR -->|No autenticado| L[Redirect /login]
    PR -->|Autenticado| RG{RoleGuard}
    RG -->|Sin permiso| F[Forbidden / 403]
    RG -->|Con permiso| P[Renderizar Page]
    P --> H[Hook + Service]
    H --> API[Backend API]
```

---

## 5. Ciclo de Vida de una Entidad Maestra

```mermaid
stateDiagram-v2
    [*] --> Activo: Crear (POST)
    Activo --> Activo: Actualizar (PUT)
    Activo --> Inactivo: Desactivar (DELETE soft)
    Inactivo --> Activo: Reactivar (PUT)
    Inactivo --> [*]: Purga (solo admin, futuro)
```

Aplica a: Clientes, Proveedores, Productos, Usuarios.

---

## 6. Flujo del Asistente IA

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend
    participant AI as AI Controller
    participant AIS as AI Service
    participant RS as Report Service
    participant LLM as Proveedor IA
    participant DB as PostgreSQL

    U->>F: "¿Cuáles fueron mis ventas este mes?"
    F->>AI: POST /api/v1/ai/chat
    AI->>AIS: process_query(message, user_context)

    AIS->>RS: get_sales_summary(company_id, month)
    RS->>DB: Agregaciones SQL
    DB-->>RS: { total, count, top_products }
    RS-->>AIS: Datos estructurados

    AIS->>AIS: Construir prompt con contexto
    AIS->>LLM: Completar(prompt)
    LLM-->>AIS: Respuesta en lenguaje natural

    AIS->>DB: Guardar conversación
    AIS-->>AI: AIResponse
    AI-->>F: { answer, sources, conversation_id }
    F-->>U: Mostrar respuesta + fuentes
```

---

*Diagramas — CONTAIA PRO v2.0*
