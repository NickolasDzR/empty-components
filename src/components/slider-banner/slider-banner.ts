const slider = document.querySelector(".slider-banner") as HTMLElement;

if (slider) {
    const slides = slider.querySelectorAll(".splide__slide") as NodeListOf<HTMLLIElement>;

    if (slides.length > 1) {
        (async () => {
            await import('@splideJs').then(async res => {
                // @ts-ignore
                await import("@splideCss")

                const splideInstance = res.Splide;

                const splide = document.querySelector(".splide") as HTMLDivElement;

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
            })
        })()
    } else {

    }
}
