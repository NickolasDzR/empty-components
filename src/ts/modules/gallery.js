/**
 * Разметка
 *
 *  <div class="parent" data-gallery-parent="data-gallery-parent">
 *      <div class="child-wrapper" data-gallery-item="data-gallery-item" data-index=0>
 *          <div class="child" data-image-source="https://placecats.com/millie/1280/640">
 *
 *          </div>
 *      </div>
 *  </div>
 *
 *  data-index - если будет слайдер и нужно открыть конкретный слайд по индексу
 *  data-image-source - ссылка на картинку, которую нужно открыть в галереи
 */
/**
 * У родителя с картинками должен быть data-gallery-parent
 * У родителя самой картинки должен быть data-gallery-item
 * У картинки должна быть data-gallery-source
 */
import { getElementsByData } from "../helpers/utils";
export default class {
    parent;
    child;
    layout;
    activeSlide;
    sliderInstance;
    sliderComponent;
    arrowSvgLayout;
    closeSvgLayout;
    constructor(parent) {
        this.parent = parent;
        this.child = parent.querySelectorAll(`[data-gallery-item]:not([class*="clone"])`);
        this.layout = undefined;
        this.activeSlide = undefined;
        this.sliderInstance = undefined;
        this.sliderComponent = undefined;
        this.arrowSvgLayout = `
            <svg class="svg" width="4" height="7" viewBox="0 0 4 7" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.315453 6.28426C0.233434 6.20222 0.187359 6.09096 0.187359 5.97495C0.187359 5.85894 0.233434 5.74768 0.315453 5.66563L2.48108 3.50001L0.315453 1.33438C0.235759 1.25187 0.191661 1.14136 0.192658 1.02665C0.193655 0.911935 0.239666 0.802205 0.320782 0.721088C0.401898 0.639972 0.511629 0.593961 0.62634 0.592965C0.741051 0.591968 0.851564 0.636065 0.934078 0.715759L3.40902 3.1907C3.49103 3.27274 3.53711 3.384 3.53711 3.50001C3.53711 3.61602 3.49103 3.72728 3.40902 3.80932L0.934078 6.28426C0.852034 6.36628 0.740775 6.41235 0.624765 6.41235C0.508756 6.41235 0.397496 6.36628 0.315453 6.28426Z"/>
            </svg>
        `;
        this.closeSvgLayout = `
            <svg class="gallery__close-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.68382 0.441786L9 6.7577L15.2835 0.474511C15.4222 0.326787 15.5894 0.208613 15.775 0.127075C15.9606 0.0455365 16.1607 0.00231422 16.3634 0C16.7974 0 17.2136 0.17239 17.5205 0.479245C17.8273 0.786101 17.9997 1.20229 17.9997 1.63625C18.0035 1.83685 17.9663 2.03612 17.8904 2.22183C17.8144 2.40753 17.7013 2.57575 17.5579 2.71617L11.1927 8.99935L17.5579 15.3644C17.8276 15.6282 17.9858 15.9854 17.9997 16.3625C17.9997 16.7964 17.8273 17.2126 17.5205 17.5195C17.2136 17.8263 16.7974 17.9987 16.3634 17.9987C16.1549 18.0074 15.9468 17.9726 15.7524 17.8965C15.5581 17.8204 15.3816 17.7048 15.2344 17.5569L9 11.241L2.70019 17.5406C2.56193 17.6834 2.39676 17.7974 2.2142 17.876C2.03165 17.9546 1.83534 17.9963 1.63658 17.9987C1.2026 17.9987 0.7864 17.8263 0.479532 17.5195C0.172663 17.2126 0.000266239 16.7964 0.000266239 16.3625C-0.00354882 16.1619 0.0336723 15.9626 0.109646 15.7769C0.185619 15.5912 0.298742 15.423 0.442071 15.2825L6.80734 8.99935L0.442071 2.63436C0.172382 2.37053 0.0142397 2.01326 0.000266239 1.63625C0.000266239 1.20229 0.172663 0.786101 0.479532 0.479245C0.7864 0.17239 1.2026 0 1.63658 0C2.0293 0.00490874 2.40565 0.163625 2.68382 0.441786Z" fill="#898989"/>
            </svg>
        `;
        this.initializer();
    }
    initializer() {
        if (this.child) {
            this.child.forEach(child => child.addEventListener("click", this.onClick.bind(this)));
        }
    }
    /**
     * Клик эвент вызывает инициализирующий галлерею метод
     * @param event
     */
    onClick(event) {
        const image = event.target;
        const listItem = image.closest("[data-gallery-item]");
        // Задаем активный слайд, если он существует.
        if (listItem && listItem.dataset && listItem.dataset.index) {
            this.activeSlide = parseInt(listItem.dataset.index);
        }
        this.createImageGallery(image);
    }
    onCloseClick(event) {
        const button = event.target;
        if (button) {
            const parentGallery = button.closest(".gallery");
            parentGallery?.addEventListener("transitionend", () => {
                setTimeout(() => {
                    parentGallery.remove();
                }, 100);
            });
            parentGallery.style.opacity = "0";
        }
    }
    /**
     * Создаем галлерею
     * @param image
     */
    createImageGallery(image) {
        if (!image)
            return;
        // Если элементов больше чем 1
        if (this.child.length > 1) {
            // Ищем и создаем массив с картинками
            const images = Array.from(this.child, item => {
                return item.querySelector("img");
            });
            // Находим адрес для картинок в data-image-source атрибуте тега img
            const imageSrc = getElementsByData(images, "imageSource");
            // Генерируем слайдер
            if (images && imageSrc) {
                this.layout = this.sliderGalleryGenerator(imageSrc);
            }
        }
        else {
            // Генерирем слайдер с одной картинкой
            this.layout = this.imageGalleryGenerator(getElementsByData([image], "imageSource"));
        }
        // Отправляем его в DOM
        this.appendSliderGenerator();
        // Инициализируем слайдер, если в нём больше одного слайда
        if (this.child.length > 1) {
            this.initializerSliderGallery(this.activeSlide ? this.activeSlide : 0);
        }
        const gallery = document.querySelector(".gallery");
        if (gallery) {
            if (this.child.length <= 1) {
                setTimeout(() => {
                    gallery.classList.add("active");
                }, 100);
            }
            gallery.querySelector(".gallery__close")?.addEventListener("click", this.onCloseClick.bind(this));
        }
    }
    /**
     * Принимает разметку слайдера и отправляет её в DOM
     */
    appendSliderGenerator() {
        if (this.layout) {
            document.body.insertAdjacentHTML("beforeend", this.layout);
        }
        else {
            console.error("Отсутствует разметка галлереи в переменной");
        }
    }
    // Создаем разметку для галлереи из одной картинки
    imageGalleryGenerator(src) {
        return `
            <section class="gallery">
                <button class="gallery__close">
                    ${this.closeSvgLayout}
                </button>
                <div class="gallery__wrapper">
                    <img class="gallery__image" src="${src}" alt="">
                </div>
            </section>
        `;
    }
    /**
     * Создаем разметку для галлереи со слайдером
     * @param images
     */
    sliderGalleryGenerator(images) {
        return `<section class="gallery">
            <button class="gallery__close">
                ${this.closeSvgLayout}
            </button>
            <div class="gallery__wrapper">
                <section class="splide gallery__slider" aria-label="Splide Basic HTML Example">
                    <div class="splide__arrows">
                        <button class="splide__arrow splide__arrow--prev slider__nav-arrow slider__nav-arrow_prev gallery__arrow gallery__arrow_prev">
                            ${this.arrowSvgLayout}
                        </button>
                        <button class="splide__arrow splide__arrow--next slider__nav-arrow slider__nav-arrow_next gallery__arrow gallery__arrow_next">
                            ${this.arrowSvgLayout}
                        </button>
                    </div>

                    <div class="splide__track gallery__track">
                        <ul class="splide__list gallery__list">
                           ${images.map((image) => `
                                <li class="splide__slide gallery__slide">
                                    <img class="gallery__image" src="${image}" alt="">
                                </li>
                            `).join("")}
                        </ul>
                    </div>
                </section>
            </div>
        </section>`;
    }
    /**
     * Импортируем слайдер
     */
    async importSplide() {
        await import("@splideJs").then(async (res) => {
            // @ts-ignore
            await import("@splideCss");
            this.sliderComponent = res.Splide;
        });
    }
    /**
     * Запускаем слайдер
     * @param activeIndex - активный индекс слайдера
     */
    async initializerSliderGallery(activeIndex = 0) {
        const gallery = document.querySelector(".gallery");
        if (gallery) {
            const slider = gallery.querySelector(".gallery__slider");
            if (slider) {
                // TODO переделать загрузку слайдера только по инициации
                await this.importSplide();
                if (this.sliderComponent) {
                    const Splide = this.sliderComponent;
                    this.sliderInstance = new Splide(slider, {
                        pagination: false,
                        arrows: true,
                        focus: "center",
                        gap: "calc(100vw)"
                    });
                    this.sliderInstance.on('mounted', () => {
                        gallery.classList.add("active");
                        if (this.sliderInstance) {
                            this.sliderInstance.go(activeIndex);
                        }
                    });
                    this.sliderInstance.mount();
                    this.sliderInstance.refresh();
                    // TODO - Сделал прелоадер
                    // window.Alpine.store("preloader").deactivate();
                }
            }
            else {
                console.error("Слайдер галереи не найден");
            }
        }
        else {
            console.error("Галерея не найдена");
        }
    }
}
