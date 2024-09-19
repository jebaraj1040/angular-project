import { Component } from "@angular/core";
import Swiper from "swiper";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
@Component({
    selector: "app-slider",
    standalone: true,
    imports: [],
    templateUrl: "./slider.component.html",
    styleUrl: "./slider.component.scss",
})
export class SliderComponent {
    ngAfterViewInit() {
        if (typeof window != "undefined") {
            setTimeout(() => {
                this.loadSlider();
            }, 500);
        }
    }

    // Load Slider
    loadSlider() {
        new Swiper("#carousel-slider", {
            modules: [Navigation, Pagination, EffectFade],
            slidesPerView: 1,
            spaceBetween: 15,
            speed: 1000,
            loop: true,
            effect: "fade",
            fadeEffect: { crossFade: true },
            pagination: {
                clickable: true,
                el: ".swiper-pagination",
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
}
