
      // JavaScript para la interacción del menú
document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item");
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");

    // Toggle del menú en móviles
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });

    // Cerrar menú al hacer clic fuera de él en móviles
    document.addEventListener("click", function (event) {
        if (window.innerWidth <= 768) {
        if (
            !sidebar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            sidebar.classList.remove("active");
        }
        }
    });

    // Manejo de elementos del menú
    menuItems.forEach((item) => {
        item.addEventListener("click", function () {
        // Si es un elemento padre con submenú
        if (this.classList.contains("menu-parent")) {
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains("submenu")) {
            submenu.classList.toggle("active");
            }
        } else {
            // Remover la clase active de todos los elementos
            menuItems.forEach((i) => i.classList.remove("active"));

            // Agregar la clase active al elemento clickeado
            this.classList.add("active");
        }

        // Cerrar el menú en móviles después de hacer clic
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("active");
        }
        });
    });

    // JavaScript para el nuevo carousel
    const newCarousel = document.querySelector(".new-carousel");
    const newPrevBtn = document.querySelector(".new-carousel-prev");
    const newNextBtn = document.querySelector(".new-carousel-next");

    // Navegación del nuevo carousel
    newNextBtn.addEventListener("click", () => {
        newCarousel.scrollBy({ left: 300, behavior: "smooth" });
    });

    newPrevBtn.addEventListener("click", () => {
        newCarousel.scrollBy({ left: -300, behavior: "smooth" });
    });

    // JavaScript para el carousel de imágenes en la sección de inicio
    const inicioCarouselImages =
        document.querySelectorAll(".carousel-image");
    const inicioCarouselDots = document.querySelectorAll(".carousel-dot");
    const inicioPrevBtn = document.querySelector(
        ".inicio-carousel .carousel-arrow.left"
    );
    const inicioNextBtn = document.querySelector(
        ".inicio-carousel .carousel-arrow.right"
    );
    let currentInicioSlide = 0;
    let isTransitioning = false;

    function showInicioSlide(index) {
        if (isTransitioning) return;

        isTransitioning = true;

        const currentImage = inicioCarouselImages[currentInicioSlide];
        const nextImage = inicioCarouselImages[index];

        // Preparar la nueva imagen para entrar desde la derecha
        nextImage.style.display = "block";
        nextImage.classList.add("slide-in");

        // Forzar reflow para que la animación funcione
        void nextImage.offsetWidth;

        // Animar: imagen actual sale a la izquierda, nueva imagen entra desde la derecha
        currentImage.classList.add("slide-out");
        nextImage.classList.add("active");

        // Actualizar dots
        inicioCarouselDots.forEach((dot) => dot.classList.remove("active"));
        inicioCarouselDots[index].classList.add("active");

        // Limpiar clases después de la transición
        setTimeout(() => {
        currentImage.style.display = "none";
        currentImage.classList.remove("active", "slide-out");
        nextImage.classList.remove("slide-in");
        currentInicioSlide = index;
        isTransitioning = false;
        }, 500);
    }

    function nextInicioSlide() {
        let nextIndex =
        (currentInicioSlide + 1) % inicioCarouselImages.length;
        showInicioSlide(nextIndex);
    }

    function prevInicioSlide() {
        let prevIndex =
        (currentInicioSlide - 1 + inicioCarouselImages.length) %
        inicioCarouselImages.length;
        showInicioSlide(prevIndex);
    }

    // Event listeners para los botones del carousel de inicio
    inicioNextBtn.addEventListener("click", nextInicioSlide);
    inicioPrevBtn.addEventListener("click", prevInicioSlide);

    // Event listeners para los dots del carousel de inicio
    inicioCarouselDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
        showInicioSlide(index);
        });
    });

    // Auto-avance del carousel de inicio cada 5 segundos
    let carouselInterval = setInterval(nextInicioSlide, 5000);

    // Pausar el auto-avance cuando el usuario interactúa con el carousel
    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextInicioSlide, 5000);
    }

    inicioNextBtn.addEventListener("click", resetCarouselInterval);
    inicioPrevBtn.addEventListener("click", resetCarouselInterval);
    inicioCarouselDots.forEach((dot) => {
        dot.addEventListener("click", resetCarouselInterval);
    });

    // Inicializar mostrando la primera imagen
    inicioCarouselImages.forEach((img, index) => {
        if (index === 0) {
        img.style.display = "block";
        img.classList.add("active");
        } else {
        img.style.display = "none";
        }
    });

    // ========== NUEVO CÓDIGO PARA LOS FILTROS ==========

    // Variables para almacenar los filtros activos
    let activeFilters = {
        tags: [],
        formato: [],
        nicho: [],
        tipo: [],
    };

    // Elementos del DOM para los filtros
    const filterSelectorBtns = document.querySelectorAll(
        ".filter-selector-btn"
    );
    const filterOptions = document.querySelectorAll(".filter-options");
    const activeFiltersContainer =
        document.getElementById("active-filters");
    const clearFilterBtn = document.querySelector(".filter-action.clear");
    const searchInput = document.getElementById("search-input");
    const carouselCards = document.querySelectorAll(".new-carousel-card");
    const carouselContainer = document.getElementById("carousel-container");

    // Almacenar las tarjetas originales para restaurar después de filtrar
    const originalCards = Array.from(carouselCards);

    // Mostrar/ocultar opciones de filtro al hacer clic en el botón
    filterSelectorBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const filterType = this.dataset.filterType;

        // Cerrar todos los demás selectores
        filterOptions.forEach((option) => {
            if (option.dataset.filterType !== filterType) {
            option.classList.remove("active");
            }
        });

        // Alternar el selector actual
        const options = document.querySelector(
            `.filter-options[data-filter-type="${filterType}"]`
        );
        options.classList.toggle("active");
        });
    });

    // Cerrar selectores al hacer clic fuera de ellos
    document.addEventListener("click", function () {
        filterOptions.forEach((option) => {
        option.classList.remove("active");
        });
    });

    // Manejar la selección de opciones de filtro
    document.querySelectorAll(".filter-option").forEach((option) => {
        option.addEventListener("click", function () {
        const filterType = this.parentElement.dataset.filterType;
        const filterValue = this.dataset.value;
        const filterLabel = this.textContent;

        // Verificar si el filtro ya está activo
        const isAlreadyActive = activeFilters[filterType].some(
            (filter) => filter.value === filterValue
        );

        if (!isAlreadyActive) {
            // Agregar el filtro
            activeFilters[filterType].push({
            value: filterValue,
            label: filterLabel,
            });

            // Actualizar la interfaz
            updateActiveFiltersDisplay();
            filterCards();
        }

        // Cerrar el selector
        this.parentElement.classList.remove("active");
        });
    });

    // Limpiar todos los filtros
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener("click", function () {
        // Limpiar todos los filtros
        activeFilters = {
            tags: [],
            formato: [],
            nicho: [],
            tipo: [],
        };

        // Limpiar la interfaz
        updateActiveFiltersDisplay();
        searchInput.value = "";
        filterCards();
        });
    }

    // Filtrar por búsqueda
    searchInput.addEventListener("input", filterCards);

    // Función para actualizar la visualización de filtros activos
    function updateActiveFiltersDisplay() {
        // Limpiar el contenedor
        activeFiltersContainer.innerHTML = "";

        // Contador de filtros activos
        let totalActiveFilters = 0;

        // Recorrer todos los tipos de filtros
        Object.keys(activeFilters).forEach((filterType) => {
        activeFilters[filterType].forEach((filter) => {
            totalActiveFilters++;
            const filterElement = document.createElement("div");
            filterElement.className = "active-filter";
            filterElement.innerHTML = `
        ${filter.label}
        <span class="remove-filter" data-type="${filterType}" data-value="${filter.value}">
            <i class="fas fa-times"></i>
        </span>
        `;
            activeFiltersContainer.appendChild(filterElement);
        });
        });

        // Mostrar u ocultar el botón "Limpiar todos" según si hay filtros activos
        if (totalActiveFilters > 0) {
        // Crear botón "Limpiar todos" si no existe
        if (!document.querySelector(".filter-action.clear.visible")) {
            const clearAllBtn = document.createElement("div");
            clearAllBtn.className = "filter-action clear visible";
            clearAllBtn.textContent = "Limpiar todos";
            clearAllBtn.addEventListener("click", function () {
            // Limpiar todos los filtros
            activeFilters = {
                tags: [],
                formato: [],
                nicho: [],
                tipo: [],
            };

            // Limpiar la interfaz
            updateActiveFiltersDisplay();
            searchInput.value = "";
            filterCards();
            });
            activeFiltersContainer.appendChild(clearAllBtn);
        }
        } else {
        // Ocultar el botón "Limpiar todos" si no hay filtros activos
        const clearBtn = document.querySelector(
            ".filter-action.clear.visible"
        );
        if (clearBtn) {
            clearBtn.remove();
        }
        }

        // Agregar event listeners para eliminar filtros individuales
        document.querySelectorAll(".remove-filter").forEach((removeBtn) => {
        removeBtn.addEventListener("click", function () {
            const filterType = this.dataset.type;
            const filterValue = this.dataset.value;

            // Remover el filtro
            activeFilters[filterType] = activeFilters[filterType].filter(
            (filter) => filter.value !== filterValue
            );

            // Actualizar la interfaz
            updateActiveFiltersDisplay();
            filterCards();
        });
        });
    }

    // Función para filtrar las tarjetas
    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();

        // Limpiar el carrusel
        carouselContainer.innerHTML = "";

        // Filtrar y mostrar las tarjetas
        originalCards.forEach((card) => {
        const cardTags = card.dataset.tags.toLowerCase().split(" ");
        const cardTitle = card.dataset.title.toLowerCase();

        // Verificar si coincide con los filtros de tags
        const matchesTags =
            activeFilters.tags.length === 0 ||
            activeFilters.tags.some((filter) =>
            cardTags.includes(filter.value.toLowerCase())
            );

        // Verificar si coincide con los filtros de formato
        const matchesFormato =
            activeFilters.formato.length === 0 ||
            activeFilters.formato.some((filter) =>
            cardTags.includes(filter.value.toLowerCase())
            );

        // Verificar si coincide con los filtros de nicho
        const matchesNicho =
            activeFilters.nicho.length === 0 ||
            activeFilters.nicho.some((filter) =>
            cardTags.includes(filter.value.toLowerCase())
            );

        // Verificar si coincide con los filtros de tipo
        const matchesTipo = activeFilters.tipo.length === 0;

        // Verificar si coincide con el término de búsqueda
        const matchesSearch =
            searchTerm === "" ||
            cardTitle.includes(searchTerm) ||
            cardTags.some((tag) => tag.includes(searchTerm));

        // Si la tarjeta coincide con todos los criterios, mostrarla
        if (
            matchesTags &&
            matchesFormato &&
            matchesNicho &&
            matchesTipo &&
            matchesSearch
        ) {
            carouselContainer.appendChild(card.cloneNode(true));
        }
        });

        // Restaurar los event listeners para los botones de las tarjetas
        document
        .querySelectorAll(".new-carousel-card .btn")
        .forEach((btn) => {
            btn.addEventListener("click", function () {
            alert("Funcionalidad de 'Ver más' activada");
            });
        });
    }

    // Inicializar los event listeners para los botones de las tarjetas
    document.querySelectorAll(".new-carousel-card .btn").forEach((btn) => {
        btn.addEventListener("click", function () {
        alert("Funcionalidad de 'Ver más' activada");
        });
    });
});
