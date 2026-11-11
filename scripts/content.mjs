// Todo el texto de las piezas vive aquí. Para cambiar un proyecto, una frase
// o un botón: editar este archivo y correr `npm run build`.

export const HERO = {
  eyebrow: 'FULLSTACK · CRM · INTEGRACIONES · IA',
  status: 'Disponible · Cajamarca, Perú',
  lead: 'Diseño y construyo',
  phrases: [
    'software a medida.',
    'integraciones API.',
    'CRMs que se usan.',
    'agentes de IA.',
    'apps web y móviles.',
    'HubSpot a medida.',
  ],
  intro:
    'Soy Victor Llerena, ingeniero de sistemas y desarrollador fullstack. CRM & AI Manager en Impulse, partner Diamond de HubSpot, y creador de los productos API de Stackea Labs.',
  proof: [
    '+6 años construyendo software',
    '+15 implementaciones de CRM',
    'Un sistema para una cadena de 17 sedes',
  ],
  terminal: {
    tab: 'comprobia',
    cwd: '~/comprobia',
    cmd: 'php artisan cpe:emitir',
    out: [
      ['run', 'XML UBL 2.1 generado'],
      ['ok', 'Firmado con el certificado'],
      ['ok', 'SUNAT: CDR aceptado'],
      ['send', 'PDF y XML en el portal'],
      ['done', 'Comprobante emitido en 1.8 s'],
    ],
    note: 'Laravel · PHP 8.4',
  },
};

export const BUTTONS = [
  { id: 'web', label: 'victorllerena.com', icon: 'globe', primary: true },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'agenda', label: 'Agendar llamada', icon: 'calendar' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
  { id: 'email', label: 'hola@victorllerena.com', icon: 'mail' },
];

export const PROOF = [
  { value: '+6', label: 'años construyendo software' },
  { value: '+15', label: 'implementaciones de HubSpot CRM' },
  { value: '17', label: 'sedes de una cadena en un solo sistema' },
  { value: '~75', label: 'sitios migrados a HubSpot CMS' },
];

const LIVE = 'En producción';
const EARLY = 'Acceso anticipado';

/** `tone` elige el color del estado: ok | early | info. */
export const CARDS = [
  // Stackea Labs — lo que construyo ahora
  {
    id: 'acredita',
    kicker: 'API · DATOS OFICIALES',
    title: 'Acredita',
    status: LIVE,
    tone: 'ok',
    summary:
      'API de RUC, DNI y tipo de cambio que responde, en cada consulta, de dónde salió el dato y de qué fecha es.',
    stack: ['Laravel 13', 'Octane', 'PostgreSQL', 'Redis'],
    accent: 'primary',
  },
  {
    id: 'comprobia',
    kicker: 'API · FACTURACIÓN SUNAT',
    title: 'Comprobia',
    status: LIVE,
    tone: 'ok',
    summary:
      'Facturación electrónica por API: tu sistema vende y Comprobia emite, firma, envía a SUNAT y reintenta.',
    stack: ['Laravel 13', 'PostgreSQL + RLS', 'Horizon'],
    accent: 'cyan',
  },
  {
    id: 'avisa',
    kicker: 'API · WHATSAPP',
    title: 'Avisa',
    status: EARLY,
    tone: 'early',
    summary:
      'Tu sistema reporta «cita creada» y Avisa decide qué mensaje de WhatsApp enviar, cuándo y cuánto cuesta.',
    stack: ['Laravel 13', 'Octane', 'Horizon', 'Filament'],
    accent: 'violet',
  },
  {
    id: 'acopla',
    kicker: 'APP PARA HUBSPOT',
    title: 'Acopla',
    status: EARLY,
    tone: 'early',
    summary:
      'Tarjetas dentro de HubSpot con RUC, DNI y tipo de cambio del Perú, y un estudio con IA que crea tarjetas nuevas.',
    stack: ['NestJS', 'Next.js', 'HubSpot UI Ext.', 'Claude API'],
    accent: 'primary',
  },
  // Proyectos
  {
    id: 'podoplus',
    kicker: 'SALUD · MULTI-SEDE',
    title: 'Podoplus',
    status: LIVE,
    tone: 'ok',
    summary:
      'Agenda, caja, inventario, suscripciones y facturación SUNAT para una cadena de 17 centros podológicos, en web y app móvil.',
    stack: ['NestJS', 'React', 'Expo', 'PostgreSQL'],
    accent: 'cyan',
  },
  {
    id: 'disena',
    kicker: 'SALUD · CLÍNICA DENTAL',
    title: 'Diseña Estudio Dental',
    status: LIVE,
    tone: 'ok',
    summary:
      'Historia clínica con odontograma, agenda, laboratorio, caja y facturación SUNAT, pensado para el iPad del consultorio.',
    stack: ['Laravel', 'Vue 3', 'MySQL'],
    accent: 'primary',
  },
  {
    id: 'farmaorden',
    kicker: 'SAAS · FARMACIAS',
    title: 'FarmaOrden',
    status: 'En staging',
    tone: 'info',
    summary:
      'Control operativo para cadenas de boticas: cada sol y cada caja de medicamento atribuidos a una persona, aunque se caiga internet.',
    stack: ['Laravel 13', 'Vue 3 + Inertia', 'PWA offline'],
    accent: 'violet',
  },
  {
    id: 'arkgamer',
    kicker: 'ECOMMERCE · 3D',
    title: 'Ark Gamer Store',
    status: LIVE,
    tone: 'ok',
    summary:
      'Catálogo de cómputo que se publica solo desde las listas de los proveedores, con «Arma tu PC» en 3D y el carrito directo a WhatsApp.',
    stack: ['Next.js 15', 'React Three Fiber', 'Drizzle'],
    accent: 'cyan',
  },
  {
    id: 'atiende',
    kicker: 'LEGALTECH · INDECOPI',
    title: 'Atiende',
    status: LIVE,
    tone: 'ok',
    summary:
      'El libro de reclamaciones que exige la ley, con los plazos contados solos y la evidencia lista para Indecopi.',
    stack: ['Laravel 13', 'Vue 3 + Inertia', 'PostgreSQL + RLS'],
    accent: 'primary',
  },
  {
    id: 'doctia',
    kicker: 'IA · RAG CON CITAS',
    title: 'Doctia',
    status: 'Demo funcional',
    tone: 'info',
    summary:
      'IA que responde sobre los documentos de tu empresa citando la fuente, respeta permisos y pide aprobación antes de actuar.',
    stack: ['Python', 'pgvector', 'LangGraph'],
    accent: 'violet',
  },
];

/** Las mismas filas que la sección «Stack» del sitio. */
export const STACK = [
  {
    label: 'Frontend y móvil',
    tools: [
      ['react', 'React'],
      ['nextjs', 'Next.js'],
      ['vue', 'Vue'],
      ['typescript', 'TypeScript'],
      ['javascript', 'JavaScript'],
      ['tailwind', 'Tailwind CSS'],
      ['vite', 'Vite'],
      ['astro', 'Astro'],
      ['shadcn', 'shadcn/ui'],
      ['radix', 'Radix UI'],
      ['react', 'React Native'],
      ['expo', 'Expo'],
      ['flutter', 'Flutter'],
    ],
  },
  {
    label: 'Backend y datos',
    tools: [
      ['laravel', 'Laravel'],
      ['php', 'PHP'],
      ['nodejs', 'Node.js'],
      ['nestjs', 'NestJS'],
      ['python', 'Python'],
      ['fastapi', 'FastAPI'],
      ['postgresql', 'PostgreSQL'],
      ['mysql', 'MySQL'],
      ['redis', 'Redis'],
      ['supabase', 'Supabase'],
      ['prisma', 'Prisma'],
    ],
  },
  {
    label: 'Nube, CRM e IA',
    tools: [
      ['docker', 'Docker'],
      ['githubactions', 'GitHub Actions'],
      ['aws', 'AWS'],
      ['gcp', 'Google Cloud'],
      ['hubspot', 'HubSpot'],
      ['n8n', 'n8n'],
      ['claude', 'Claude'],
      ['chatgpt', 'ChatGPT'],
      ['whatsapp', 'WhatsApp API'],
      ['meta', 'Meta'],
      ['woocommerce', 'WooCommerce'],
      ['wordpress', 'WordPress'],
    ],
  },
];

export const FOOTER = { tagline: 'Más allá del código.' };

/** Lenguajes de marcado y de configuración: no cuentan como «lo que programo». */
export const LANG_SKIP = new Set([
  'HTML', 'CSS', 'SCSS', 'Less', 'MDX', 'Dockerfile', 'Shell', 'PowerShell', 'Batchfile',
  'Makefile', 'CMake', 'Jinja', 'XSLT', 'Procfile', 'DIGITAL Command Language', 'Hack',
]);
