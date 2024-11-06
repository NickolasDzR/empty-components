"use strict";
const sliderBanner = document.querySelector(".slider-banner");
if (sliderBanner) {
    const slides = sliderBanner.querySelectorAll(".splide__slide");
    if (slides.length > 1) {
        (async () => {
            await import('@splideJs').then(async (res) => {
                // @ts-ignore
                await import("@splideCss");
                const splideInstance = res.Splide;
                const splide = sliderBanner.querySelector(".splide");
                if (splide) {
                    const splideSlider = new splideInstance(splide, {
                        type: 'loop',
                        lazyLoad: true,
                        autoplay: true,
                        perPage: 1,
                        autoHeight: true,
                        interval: 2000,
                        pagination: true,
                        arrows: false,
                        speed: 600,
                        rewind: true,
                        classes: {
                            pagination: "pagination",
                            page: "pagination-button"
                        }
                    });
                    splideSlider.mount();
                }
            });
        })();
    }
    else {
    }
}
