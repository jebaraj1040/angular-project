import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModalService {

    openModal(element: any) {
        let id = element.getAttribute('data-modal-target');
        this.initModal(id);
    }

    showModal(id: any) {
        this.initModal('#' + id);
    }

    initModal(id: any) {
        document.body.classList.add('modal-open');
        document.body.insertAdjacentHTML(
            'beforeend',
            '<div class="modal-backdrop fade"></div>'
        );
        var backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
        backdrop.classList.add('show');
        let activeTabContent = document.body.querySelector(id) as HTMLElement;
        activeTabContent.style.display = 'block';
        setTimeout(() => {
            activeTabContent.classList.add('show');
            // Modal align at Bottom
            if (window.innerWidth <= 767) {
                if (activeTabContent.classList.contains('modal-align-mobile-bottom')) {
                    activeTabContent.classList.add('modal-up-animate');
                }
            }
        }, 300);
    }

    closeModal(): Promise<any> {
        return new Promise((resolve, reject) => {
            let modal = document.querySelector('.modal.fade.show') as HTMLElement;
            if (modal?.style?.display == 'block') {
                // Modal align at Bottom
                if (modal.classList.contains('modal-align-mobile-bottom')) {
                    if (window.innerWidth >= 768) {
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.style.display = 'none';
                        }, 100);
                    } else {
                        modal.classList.remove('modal-up-animate');
                        setTimeout(() => {
                            modal.classList.remove('show');
                            modal.style.display = 'none';
                        }, 1000);
                    }
                } else {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 100);
                }
            }

            let video = document.querySelector(
                '.modal-video-iframe'
            ) as HTMLElement;
            if (video) {
                video.setAttribute('src', ' ');
            }

            // Modal align at Bottom
            if (modal?.classList.contains('modal-align-mobile-bottom')) {
                if (window.innerWidth >= 768) {
                    this.timeOutDelay(150, 250);
                } else {
                    this.timeOutDelay(600, 650);
                }
            } else {
                this.timeOutDelay(150, 250);
            }
            resolve(true);
        });
    }

    timeOutDelay(timer1: number, timer2: number) {
        setTimeout(() => {
            let backdrop = document.querySelector(
                '.modal-backdrop'
            ) as HTMLElement;
            this.modalBackDropClear();
            backdrop?.classList.remove('show');
            backdrop?.remove();
        }, timer1);
        setTimeout(() => {
            let body = document.body;
            body?.classList.remove('modal-open');
            this.modalBackDropClear();
        }, timer2);

    }

    modalBackDropClear(): void {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop.fade');
        modalBackdrops.forEach(backdrop => {
            backdrop.remove();
        });
    }
}
