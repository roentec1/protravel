/**
 * ProTravel - Script principal
 * Agencia de Viajes | Guadalupe, Nuevo León
 * Vanilla JavaScript - Sin frameworks
 */

/* ============================================
   CONFIGURACIÓN EDITABLE
   Cambia estos valores fácilmente
   ============================================ */
const whatsappNumber = "528180165371"; // Número real de ProTravel (sin + ni espacios)

const socialLinks = {
    facebook: "https://www.facebook.com/protravel.mx",   // Reemplazar con URL real
    instagram: "https://www.instagram.com/protravel.mx/", // Reemplazar con URL real
    tiktok: "AQUI_LINK_TIKTOK",       // Reemplazar con URL real
    whatsapp: `https://wa.me/${whatsappNumber}`
};

const defaultWhatsAppMessage = `¡Hola buen día! contamos con distintos paquetes, nos pudieras apoyar contestando las siguientes preguntas:

👨‍👩‍👧‍👦¿Para cuántas personas sería el viaje?
Si hay menores, ¿Qué edades tienen?

📆¿En qué fechas sería?

📌¿Durante cuantos días?

🏨¿Buscabas un hotel en especial o le recomendaron alguno?

🗺️¿A qué destino sería?`;

/* ============================================
   DESTINOS - Fácil de ampliar
   Agregar nuevos objetos al array
   ============================================ */
const destinos = [
    {
        id: "cancun",
        nombre: "Cancún",
        descripcion: "Descubre playas paradisíacas, hoteles espectaculares y experiencias inolvidables en el Caribe mexicano.",
        imagen: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
        alt: "Playa de Cancún con agua turquesa"
    },
    {
        id: "mazatlan",
        nombre: "Mazatlán",
        descripcion: "Disfruta del malecón, gastronomía deliciosa y atardeceres únicos en la Perla del Pacífico.",
        imagen: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
        alt: "Malecón y playa de Mazatlán"
    },
    {
        id: "riviera-maya",
        nombre: "Riviera Maya",
        descripcion: "Cenotes, ruinas mayas, resorts todo incluido y la magia de la selva tropical te esperan.",
        imagen: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80",
        alt: "Cenote y vegetación en Riviera Maya"
    },
    {
        id: "tulum",
        nombre: "Tulum",
        descripcion: "Ruinas frente al mar, playas vírgenes y un ambiente bohemio único en el Caribe.",
        imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        alt: "Ruinas de Tulum frente al mar Caribe"
    },
    {
        id: "las-vegas",
        nombre: "Las Vegas",
        descripcion: "Espectáculos de clase mundial, casinos, shows y una energía que no encontrarás en ningún otro lugar.",
        imagen: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&q=80",
        alt: "Las Vegas Strip de noche"
    },
    {
        id: "europa",
        nombre: "Europa",
        descripcion: "Ciudades históricas, cultura milenaria, paisajes de ensueño y experiencias únicas en el Viejo Continente.",
        imagen: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
        alt: "Ciudad europea histórica con arquitectura clásica"
    }
];

/* ============================================
   UTILIDADES
   ============================================ */
function openWhatsApp(message) {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function formatDate(dateStr) {
    if (!dateStr) return "No especificada";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10;
}

function showError(input, message) {
    input.classList.add("error");
    const errorEl = input.parentElement.querySelector(".error-msg");
    if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
    input.classList.remove("error");
    const errorEl = input.parentElement.querySelector(".error-msg");
    if (errorEl) errorEl.textContent = "";
}

function clearAllErrors(form) {
    form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    form.querySelectorAll(".error-msg").forEach(el => (el.textContent = ""));
}

/* ============================================
   RENDER DESTINOS
   ============================================ */
function renderDestinos() {
    const grid = document.getElementById("destinosGrid");
    if (!grid) return;

    grid.innerHTML = destinos
        .map(
            (d) => `
        <article class="destino-card reveal" data-destino="${d.id}">
            <div class="destino-img">
                <img src="${d.imagen}" alt="${d.alt}" loading="lazy" width="400" height="240">
            </div>
            <div class="destino-content">
                <h3>${d.nombre}</h3>
                <p>${d.descripcion}</p>
                <button type="button" class="btn btn-primary btn-info-destino" data-destino="${d.nombre}">
                    Quiero información
                </button>
            </div>
        </article>
    `
        )
        .join("");

    // Event listeners para botones de destino
    grid.querySelectorAll(".btn-info-destino").forEach((btn) => {
        btn.addEventListener("click", () => {
            openDestinoModal(btn.dataset.destino);
        });
    });
}

/* ============================================
   MODAL DESTINO
   ============================================ */
const modal = document.getElementById("destinoModal");
const modalForm = document.getElementById("destinoForm");

function openDestinoModal(destinoNombre) {
    if (!modal) return;
    document.getElementById("modalDestino").value = destinoNombre;
    document.getElementById("modalDestinoDisplay").value = destinoNombre;
    document.getElementById("modalTitle").textContent = `Información sobre ${destinoNombre}`;
    modal.hidden = false;
    // Force reflow for animation
    void modal.offsetWidth;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    clearAllErrors(modalForm);
    modalForm.reset();
    document.getElementById("modalDestino").value = destinoNombre;
    document.getElementById("modalDestinoDisplay").value = destinoNombre;
}

function closeDestinoModal() {
    if (!modal) return;
    modal.classList.remove("active");
    setTimeout(() => {
        modal.hidden = true;
        document.body.style.overflow = "";
    }, 300);
}

function buildDestinoWhatsAppMessage(data) {
    let msg = `Hola ProTravel, requiero información sobre un paquete para:\n\n`;
    msg += `📍 *Destino:* ${data.destino}\n`;
    msg += `👤 *Nombre:* ${data.nombre}\n`;
    msg += `📞 *Teléfono:* ${data.telefono}\n`;
    msg += `📧 *Correo:* ${data.email}\n`;
    msg += `👥 *Viajeros:* ${data.viajeros} (${data.adultos} adultos`;
    if (data.menores && parseInt(data.menores) > 0) {
        msg += `, ${data.menores} menores`;
        if (data.edades) msg += ` — edades: ${data.edades}`;
    }
    msg += `)\n`;
    msg += `📅 *Fecha aproximada:* ${formatDate(data.fecha)}\n`;
    msg += `🗓️ *Duración:* ${data.dias} días\n`;
    msg += `✈️ *Tipo de viaje:* ${data.tipo}\n`;
    if (data.hotel) msg += `🏨 *Hotel de interés:* ${data.hotel}\n`;
    if (data.presupuesto) msg += `💰 *Presupuesto:* ${data.presupuesto}\n`;
    if (data.comentarios) msg += `\n💬 *Comentarios:* ${data.comentarios}\n`;
    msg += `\nMe gustaría recibir información sobre paquetes y promociones disponibles.`;
    return msg;
}

function handleDestinoFormSubmit(e) {
    e.preventDefault();
    clearAllErrors(modalForm);

    const data = {
        nombre: document.getElementById("modalNombre").value.trim(),
        telefono: document.getElementById("modalTelefono").value.trim(),
        email: document.getElementById("modalEmail").value.trim(),
        destino: document.getElementById("modalDestino").value,
        viajeros: document.getElementById("modalViajeros").value,
        adultos: document.getElementById("modalAdultos").value,
        menores: document.getElementById("modalMenores").value || "0",
        edades: document.getElementById("modalEdades").value.trim(),
        fecha: document.getElementById("modalFecha").value,
        dias: document.getElementById("modalDias").value,
        tipo: document.getElementById("modalTipo").value,
        hotel: document.getElementById("modalHotel").value.trim(),
        presupuesto: document.getElementById("modalPresupuesto").value.trim(),
        comentarios: document.getElementById("modalComentarios").value.trim()
    };

    let valid = true;

    if (!data.nombre || data.nombre.length < 2) {
        showError(document.getElementById("modalNombre"), "Ingresa tu nombre completo");
        valid = false;
    }
    if (!validatePhone(data.telefono)) {
        showError(document.getElementById("modalTelefono"), "Ingresa un teléfono válido (mín. 10 dígitos)");
        valid = false;
    }
    if (!validateEmail(data.email)) {
        showError(document.getElementById("modalEmail"), "Ingresa un correo válido");
        valid = false;
    }
    if (!data.viajeros || parseInt(data.viajeros) < 1) {
        showError(document.getElementById("modalViajeros"), "Indica el número de viajeros");
        valid = false;
    }
    if (!data.adultos || parseInt(data.adultos) < 1) {
        showError(document.getElementById("modalAdultos"), "Indica el número de adultos");
        valid = false;
    }
    if (!data.fecha) {
        showError(document.getElementById("modalFecha"), "Selecciona una fecha aproximada");
        valid = false;
    }
    if (!data.dias || parseInt(data.dias) < 1) {
        showError(document.getElementById("modalDias"), "Indica la duración del viaje");
        valid = false;
    }
    if (!data.tipo) {
        showError(document.getElementById("modalTipo"), "Selecciona el tipo de viaje");
        valid = false;
    }

    if (!valid) return;

    const message = buildDestinoWhatsAppMessage(data);
    openWhatsApp(message);
    closeDestinoModal();
}

/* ============================================
   FORMULARIO DE COTIZACIÓN PRINCIPAL
   ============================================ */
function buildCotizacionMessage(data) {
    let msg = `Hola ProTravel, solicito una cotización para mi viaje:\n\n`;
    msg += `👤 *Nombre:* ${data.nombre} ${data.apellido}\n`;
    msg += `📞 *Teléfono:* ${data.telefono}\n`;
    msg += `📧 *Correo:* ${data.email}\n`;
    msg += `📍 *Destino:* ${data.destino}\n`;
    msg += `👥 *Viajeros:* ${data.viajeros} (${data.adultos} adultos`;
    if (data.menores && parseInt(data.menores) > 0) {
        msg += `, ${data.menores} menores`;
        if (data.edadesMenores) msg += ` — edades: ${data.edadesMenores}`;
    }
    msg += `)\n`;
    msg += `📅 *Fecha de viaje:* ${formatDate(data.fechaViaje)}\n`;
    msg += `🗓️ *Duración:* ${data.duracion} días\n`;
    msg += `✈️ *Tipo de viaje:* ${data.tipoViaje}\n`;
    if (data.hotel) msg += `🏨 *Hotel de interés:* ${data.hotel}\n`;
    if (data.presupuesto) msg += `💰 *Presupuesto:* ${data.presupuesto}\n`;
    if (data.comentarios) msg += `\n💬 *Comentarios:* ${data.comentarios}\n`;
    msg += `\n¡Gracias! Espero su respuesta.`;
    return msg;
}

function handleCotizacionSubmit(e) {
    e.preventDefault();
    const form = document.getElementById("cotizacionForm");
    clearAllErrors(form);

    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        viajeros: document.getElementById("viajeros").value,
        adultos: document.getElementById("adultos").value,
        menores: document.getElementById("menores").value || "0",
        edadesMenores: document.getElementById("edadesMenores").value.trim(),
        destino: document.getElementById("destino").value.trim(),
        fechaViaje: document.getElementById("fechaViaje").value,
        duracion: document.getElementById("duracion").value,
        tipoViaje: document.getElementById("tipoViaje").value,
        hotel: document.getElementById("hotel").value.trim(),
        presupuesto: document.getElementById("presupuesto").value.trim(),
        comentarios: document.getElementById("comentarios").value.trim()
    };

    let valid = true;

    if (!data.nombre) {
        showError(document.getElementById("nombre"), "Campo obligatorio");
        valid = false;
    }
    if (!data.apellido) {
        showError(document.getElementById("apellido"), "Campo obligatorio");
        valid = false;
    }
    if (!validateEmail(data.email)) {
        showError(document.getElementById("email"), "Correo inválido");
        valid = false;
    }
    if (!validatePhone(data.telefono)) {
        showError(document.getElementById("telefono"), "Teléfono inválido (mín. 10 dígitos)");
        valid = false;
    }
    if (!data.viajeros || parseInt(data.viajeros) < 1) {
        showError(document.getElementById("viajeros"), "Indica el número de viajeros");
        valid = false;
    }
    if (!data.adultos || parseInt(data.adultos) < 1) {
        showError(document.getElementById("adultos"), "Indica el número de adultos");
        valid = false;
    }
    if (!data.destino) {
        showError(document.getElementById("destino"), "Indica el destino");
        valid = false;
    }
    if (!data.fechaViaje) {
        showError(document.getElementById("fechaViaje"), "Selecciona una fecha");
        valid = false;
    }
    if (!data.duracion || parseInt(data.duracion) < 1) {
        showError(document.getElementById("duracion"), "Indica la duración");
        valid = false;
    }
    if (!data.tipoViaje) {
        showError(document.getElementById("tipoViaje"), "Selecciona el tipo de viaje");
        valid = false;
    }

    if (!valid) {
        const firstError = form.querySelector(".error");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    // Mostrar confirmación visual
    const successEl = document.getElementById("formSuccess");
    form.querySelector(".form-grid").style.display = "none";
    form.querySelector(".form-actions").style.display = "none";
    successEl.hidden = false;

    // Abrir WhatsApp con el mensaje
    const message = buildCotizacionMessage(data);
    setTimeout(() => openWhatsApp(message), 800);
}

function handleCotizacionWA() {
    const form = document.getElementById("cotizacionForm");
    // Intentar validar y enviar igual
    const event = new Event("submit", { cancelable: true });
    form.dispatchEvent(event);
}

/* ============================================
   HORARIO DE ATENCIÓN
   ============================================ */
function updateHorarioStatus() {
    const statusEl = document.getElementById("horarioStatus");
    if (!statusEl) return;

    // Hora de México (UTC-6)
    const now = new Date();
    const options = { timeZone: "America/Monterrey", hour: "numeric", minute: "numeric", hour12: false, weekday: "short" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(now);
    
    let hour = 0, minute = 0, weekday = "";
    parts.forEach((p) => {
        if (p.type === "hour") hour = parseInt(p.value, 10);
        if (p.type === "minute") minute = parseInt(p.value, 10);
        if (p.type === "weekday") weekday = p.value;
    });

    const timeMinutes = hour * 60 + minute;
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const day = dayMap[weekday] ?? now.getDay();

    let isOpen = false;

    // Lunes a viernes: 11:00 - 20:00
    if (day >= 1 && day <= 5) {
        isOpen = timeMinutes >= 11 * 60 && timeMinutes < 20 * 60;
    }
    // Sábado: 10:00 - 14:00
    else if (day === 6) {
        isOpen = timeMinutes >= 10 * 60 && timeMinutes < 14 * 60;
    }
    // Domingo: cerrado

    const textEl = statusEl.querySelector(".status-text");
    if (isOpen) {
        statusEl.classList.add("open");
        statusEl.classList.remove("closed");
        textEl.textContent = "Estamos atendiendo";
    } else {
        statusEl.classList.add("closed");
        statusEl.classList.remove("open");
        textEl.textContent = "Fuera de horario";
    }
}

/* ============================================
   REDES SOCIALES
   ============================================ */
function renderSocialLinks() {
    const container = document.getElementById("socialLinks");
    if (!container) return;

    const icons = {
        facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
        instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/></svg>`,
        tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.2 8.2 0 0 0 4.77 1.52V6.87a4.85 4.85 0 0 1-1.45-.18z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`
    };

    const labels = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", whatsapp: "WhatsApp" };

    container.innerHTML = Object.entries(socialLinks)
        .map(([key, url]) => {
            const isPlaceholder = url.startsWith("AQUI_");
            const href = isPlaceholder ? "#" : url;
            const title = isPlaceholder ? `${labels[key]} (próximamente)` : labels[key];
            return `
            <a href="${href}" class="social-link" target="_blank" rel="noopener noreferrer" 
               aria-label="${title}" title="${title}" ${isPlaceholder ? 'onclick="return false;"' : ""}>
                ${icons[key] || ""}
            </a>`;
        })
        .join("");
}

/* ============================================
   NAVEGACIÓN & UI
   ============================================ */
function initNavigation() {
    const header = document.getElementById("header");
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("nav");
    const navLinks = document.querySelectorAll(".nav-link");

    // Overlay para móvil
    let overlay = document.querySelector(".nav-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "nav-overlay";
        document.body.appendChild(overlay);
    }

    function closeMenu() {
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    function openMenu() {
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
        nav.classList.add("open");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    hamburger?.addEventListener("click", () => {
        if (nav.classList.contains("open")) closeMenu();
        else openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
            // Active state
            navLinks.forEach((l) => l.classList.remove("active"));
            if (!link.classList.contains("nav-whatsapp")) {
                link.classList.add("active");
            }
        });
    });

    // Sticky header
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
    });

    // Active link on scroll
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY + 100;
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach((l) => {
                    l.classList.remove("active");
                    if (l.getAttribute("href") === `#${id}`) l.classList.add("active");
                });
            }
        });
    });
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal, .why-card, .servicio-card, .destino-card");
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    entry.target.classList.add("reveal");
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });
}

/* ============================================
   WHATSAPP LINKS
   ============================================ */
function initWhatsAppLinks() {
    const msg = defaultWhatsAppMessage;

    // Float button
    document.getElementById("whatsappFloat")?.addEventListener("click", (e) => {
        e.preventDefault();
        openWhatsApp(msg);
    });

    // Nav WhatsApp
    document.getElementById("navWhatsApp")?.addEventListener("click", (e) => {
        e.preventDefault();
        openWhatsApp(msg);
    });

    // Contacto WhatsApp
    document.getElementById("contactoWhatsApp")?.addEventListener("click", (e) => {
        e.preventDefault();
        openWhatsApp(msg);
    });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
    renderDestinos();
    renderSocialLinks();
    initNavigation();
    initScrollReveal();
    initWhatsAppLinks();
    updateHorarioStatus();
    // Actualizar horario cada minuto
    setInterval(updateHorarioStatus, 60000);

    // Modal events
    document.getElementById("modalClose")?.addEventListener("click", closeDestinoModal);
    document.getElementById("modalBackdrop")?.addEventListener("click", closeDestinoModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && !modal.hidden) closeDestinoModal();
    });
    modalForm?.addEventListener("submit", handleDestinoFormSubmit);

    // Cotización form
    document.getElementById("cotizacionForm")?.addEventListener("submit", handleCotizacionSubmit);
    document.getElementById("btnCotizacionWA")?.addEventListener("click", handleCotizacionWA);

    // Min date for date inputs (hoy)
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("fechaViaje")?.setAttribute("min", today);
    document.getElementById("modalFecha")?.setAttribute("min", today);
});
