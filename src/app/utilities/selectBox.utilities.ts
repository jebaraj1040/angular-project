export function selectBoxInput($event: any) {
    let event = $event.currentTarget
        .closest('.type-select')
        .querySelector('.select-box');
    if (!event.classList.contains('show')) {
        selectBoxHide('show');
        selectBoxShow($event, 'show');
    } else {
        selectBoxHide('show');
    }
    $event.stopImmediatePropagation();
}

export function selectBoxOption($event: any) {
    let event = $event.currentTarget;
    event.closest('.type-select').classList.add('focused');
    let ele = event as HTMLElement;
    let input = event
        .closest('.type-select')
        .querySelector('.form-control') as HTMLInputElement;
    input.value = ele.innerText;
    selectBoxHide('show');
    $event.stopImmediatePropagation();
}

export function selectBoxShow($event: any, show: any) {
    let event = $event.currentTarget;
    let select = event
        .closest('.type-select')
        .querySelector('.select-box') as HTMLElement;
    select.classList.add(show);
    let selectHeight = event
        .closest('.type-select')
        .querySelector('.select-box ul').offsetHeight as HTMLElement;
    event.closest('.type-select').querySelector('.select-box').style.height =
        selectHeight + 'px';
}

export function selectBoxHide(show: any) {
    if (typeof window != 'undefined') {
        let selectBox = document.querySelectorAll('.select-box') as NodeList;
        if (selectBox) {
            selectBox.forEach(function (ele: any) {
                ele.classList.remove(show);
            });
        }
    }
}

export function selectBoxSearch($event: any) {
    let event = $event.currentTarget;
    event.closest('.type-select').querySelector('.select-box').style.height =
        '';
    setTimeout(() => {
        let selectHeight = event
            .closest('.type-select')
            .querySelector('.select-box ul').offsetHeight as HTMLElement;
        event
            .closest('.type-select')
            .querySelector('.select-box').style.height = selectHeight + 'px';
    }, 100);
}
