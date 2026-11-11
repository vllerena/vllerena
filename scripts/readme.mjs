// Escribe README.md. El contenido editable está aquí abajo, en markdown;
// las funciones de arriba solo arman el <picture> claro/oscuro de cada pieza.
//   npm run readme
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/kit.mjs';

const G = 'assets/generated';
const pic = (name, alt, attr) =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="${G}/${name}-dark.svg"><img src="${G}/${name}-light.svg" ${attr} alt="${alt}"></picture>`;
const full = (name, alt) => pic(name, alt, 'width="100%"');
const card = (id, href, alt) => `<a href="${href}">${pic(`card-${id}`, alt, 'width="49.9%"')}</a>`;
const btn = (id, href, alt) => `<a href="${href}">${pic(`btn-${id}`, alt, 'height="40"')}</a>`;

const SITE = 'https://victorllerena.com';
const P = `${SITE}/proyectos/`;

const md = `<div align="center">

<a href="${SITE}">${full('hero', 'Victor Llerena — Fullstack · CRM · Integraciones · IA. Diseño y construyo software a medida, integraciones API, CRMs y agentes de IA.')}</a>

<p>
${btn('web', SITE, 'victorllerena.com')}
${btn('linkedin', 'https://www.linkedin.com/in/vllerena/', 'LinkedIn')}
${btn('agenda', `${SITE}/agenda`, 'Agendar llamada')}
${btn('whatsapp', 'https://wa.me/51925786403', 'WhatsApp')}
${btn('email', 'mailto:hola@victorllerena.com', 'hola@victorllerena.com')}
</p>

</div>

### Sobre mí

Soy ingeniero de sistemas y llevo más de 6 años construyendo software. Hoy soy **CRM & AI Manager en Impulse**, el primer partner Diamond de HubSpot en Perú, donde diseño arquitecturas de CRM, integraciones y agentes de IA para empresas de LATAM. En paralelo construyo **[Stackea Labs](https://stackealabs.com)**, mi marca de productos API para el mercado peruano.

Lo más importante lo aprendí con un CRM técnicamente impecable que nadie usó: los vendedores eran de campo y vendían por WhatsApp, desde el celular. Desde entonces **trabajo desde el problema, no desde la herramienta**.

${full('proof', '+6 años construyendo software · +15 implementaciones de HubSpot CRM · 17 sedes de una cadena en un solo sistema · ~75 sitios migrados a HubSpot CMS')}

**Lo que aporto a un equipo**

- **CRM y RevOps** — arquitectura e implementación de HubSpot Enterprise, automatización y reporting. Certificado en 5 Hubs.
- **Integraciones** — APIs, webhooks y middleware entre CRM, ERP, ecommerce, POS, WhatsApp y facturación SUNAT.
- **Producto fullstack** — de la base de datos al deploy: Laravel o NestJS, React, Vue o Next.js, PostgreSQL, multi-tenant.
- **IA aplicada** — agentes con tool calling, MCP y automatización con n8n, con revisión humana donde importa.
- **Liderazgo** — fui docente 5 años antes de programar: lidero reuniones, capacito equipos y explico lo técnico a negocio.

### Lo que estoy construyendo ahora

**[Stackea Labs](https://stackealabs.com)** — los tres dolores que se repetían en cada sistema que desarrollaba (identificar al cliente, facturarle y escribirle), convertidos en productos API multi-tenant.

<p align="center">
${card('acredita', 'https://acredita.stackealabs.com', 'Acredita — API de RUC, DNI y tipo de cambio con la procedencia de cada dato. En producción.')}${card('comprobia', 'https://comprobia.stackealabs.com', 'Comprobia — facturación electrónica SUNAT por API. En producción.')}
${card('avisa', 'https://avisa.stackealabs.com', 'Avisa — eventos de negocio convertidos en mensajes de WhatsApp. Acceso anticipado.')}${card('acopla', 'https://acopla.stackealabs.com', 'Acopla — tarjetas para HubSpot con datos peruanos. Acceso anticipado.')}
</p>

### Proyectos

Casi todo mi código vive en repositorios privados, de clientes y de producto. Cada tarjeta lleva al caso completo.

<p align="center">
${card('podoplus', `${P}podoplus-app`, 'Podoplus — plataforma para una cadena de 17 centros podológicos. En producción.')}${card('disena', `${P}disena-app`, 'Diseña Estudio Dental — sistema integral para una clínica odontológica. En producción.')}
${card('farmaorden', `${P}farmaorden`, 'FarmaOrden — control operativo para cadenas de boticas. En staging.')}${card('arkgamer', `${P}ark-gamer-store`, 'Ark Gamer Store — tienda de cómputo con configurador de PC en 3D. En producción.')}
${card('atiende', `${P}atiende`, 'Atiende — libro de reclamaciones virtual. En producción.')}${card('doctia', `${P}doctia`, 'Doctia — asistente de IA que responde citando la fuente. Demo funcional.')}
</p>

<p align="center"><a href="${SITE}/proyectos"><b>Ver todos los casos →</b></a></p>

### Actividad en GitHub

${full('activity', 'Contribuciones, commits y pull requests de los últimos 12 meses, con el calendario de actividad')}

<p align="center">
${pic('languages', 'Lenguajes más usados en los repositorios activos', 'width="49.9%"')}${pic('rhythm', 'Ritmo semanal de contribuciones y rachas', 'width="49.9%"')}
</p>

<sub>Se actualiza solo cada día con GitHub Actions. Incluye la actividad en repositorios privados.</sub>

### Stack

${full('stack', 'Stack: frontend y móvil, backend y datos, nube, CRM e IA')}

### Trayectoria

| Periodo | Rol | Dónde |
|---|---|---|
| feb 2026 – hoy | **CRM & AI Manager** | Impulse · HubSpot Diamond Partner |
| mar 2025 – ene 2026 | CRM & Marketing Automation Leader | Protecso · HubSpot Gold Partner |
| mar 2022 – mar 2025 | Full Stack & HubSpot Developer | Impulse |
| 2019 – 2021 | Full Stack Developer | Primeros proyectos: facturación electrónica, apps móviles y sistemas a medida |
| Antes | Docente de computación | 5 años en aula |

- **~75 sitios web** de dos universidades migrados a HubSpot CMS, a un ritmo de 10 por semana.
- **+15 implementaciones** de HubSpot en retail, educación, finanzas, salud y seguros.
- Integración en n8n entre la app de ventas de una financiera y HubSpot: contactos, ventas y asociaciones sincronizados.
- **1er puesto, Innovatec Cajamarca 2019**, con un sistema de gestión académica.

**Formación** — Ingeniero de Sistemas Computacionales, Universidad Privada del Norte.<br>
**Certificaciones** — HubSpot Academy en 5 Hubs (Marketing, Sales, Service, Operations y CMS) · Claude Code in Action · Cisco CCNA R&S y Cybersecurity Essentials · PCAP Python.

### Escribo sobre esto

- [Migré 6 sistemas a un servidor nuevo y nadie lo notó: el checklist](${SITE}/contenido/migrar-sistemas-a-otro-servidor)
- [¿Cuánto cuesta un sistema a medida y cuánto tarda?](${SITE}/contenido/cuanto-cuesta-un-sistema-a-medida)
- [La IA no reemplaza tu CRM: lo vuelve más inteligente](${SITE}/contenido/la-ia-no-reemplaza-tu-crm)

Más en **[victorllerena.com/contenido](${SITE}/contenido)**, y en qué ando esta semana en **[/now](${SITE}/now)**.

<div align="center">

<a href="${SITE}">${full('footer', 'Victor Llerena — Más allá del código.')}</a>

<p>
<a href="https://www.linkedin.com/in/vllerena/">LinkedIn</a> ·
<a href="https://www.youtube.com/@vllerena">YouTube</a> ·
<a href="https://www.instagram.com/victorllerenac">Instagram</a> ·
<a href="https://x.com/llerena_victor">X</a> ·
<a href="https://www.tiktok.com/@victorllerenac">TikTok</a> ·
<a href="https://www.facebook.com/vllerenacaballero">Facebook</a>
</p>

<img src="https://komarev.com/ghpvc/?username=vllerena&label=Visitas+al+perfil&color=2563EB&style=flat-square" alt="Visitas al perfil">

</div>
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log('✓ README.md');
