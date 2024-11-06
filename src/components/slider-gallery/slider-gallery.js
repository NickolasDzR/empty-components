import Gallery from "../../ts/modules/gallery";
const sliderGallery = document.querySelector(".slider-gallery");
if (sliderGallery) {
    const slides = sliderGallery.querySelectorAll(".splide__slide");
    const galleryParent = sliderGallery.querySelector(".splide__list");
    if (slides.length > 1) {
        (async () => {
            await import('@splideJs').then(async (res) => {
                // @ts-ignore
                await import("@splideCss");
                const splideInstance = res.Splide;
                const splide = sliderGallery.querySelector(".splide");
                if (splide) {
                    const splideSlider = new splideInstance(splide, {
                        type: 'loop',
                        lazyLoad: true,
                        autoplay: true,
                        perPage: 1,
                        autoHeight: true,
                        interval: 2000,
                        pagination: false,
                        arrows: true,
                        arrowPath: 'M0.939341 10.9393C0.353554 11.5251 0.353554 12.4749 0.939341 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939341 10.9393ZM26 10.5L2 10.5V13.5L26 13.5V10.5Z',
                        speed: 600,
                        rewind: true,
                        classes: {
                            pagination: "pagination",
                            page: "pagination-button"
                        }
                    });
                    console.log("Assss");
                    splideSlider.on("mounted", () => {
                        console.log("mounted slider gallery");
                        new Gallery(galleryParent);
                    });
                    splideSlider.mount();
                }
            });
        })();
    }
    else {
        new Gallery(galleryParent);
    }
}
