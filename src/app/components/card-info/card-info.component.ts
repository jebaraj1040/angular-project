import { Component } from "@angular/core";
import Swiper from "swiper";
import { register } from "swiper/element/bundle";
register();

@Component({
    selector: "app-card-info",
    standalone: true,
    imports: [],
    templateUrl: "./card-info.component.html",
    styleUrl: "./card-info.component.scss",
})
export class CardInfoComponent {
    ngAfterViewInit() {
        if (typeof window != "undefined") {
            this.loadSlider();
        }
    }

    // Load Slider
    loadSlider() {
        if (window.innerWidth < 1200) {
            new Swiper("#carousel-swiper-item1", {
                slidesPerView: 1,
                spaceBetween: 20,
                speed: 800,
                loop: true,
                autoplay: true,
            });
        }
    }
}
