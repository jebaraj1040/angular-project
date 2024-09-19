import { AbstractControl, ValidatorFn } from "@angular/forms";

export function alphaNumeric(): ValidatorFn {
    return (control: AbstractControl): any => {
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                if (control.value && control.value != "") {
                    let trimedvalue = control.value.replace(
                        /[^a-zA-Z0-9]/gm,
                        ""
                    );
                    control.setValue(trimedvalue);
                }
            }, 10);
        }
    };
}

export function alphaNumericDot(): ValidatorFn {
    return (control: AbstractControl): any => {
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                if (control.value && control.value != "") {
                    let trimedvalue = control.value.replace(
                        /[^a-zA-Z0-9 .]/gm,
                        ""
                    );
                    control.setValue(trimedvalue);
                }
            }, 10);
        }
    };
}

export function emailValidations(): ValidatorFn {
    return (control: AbstractControl): any => {
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                if (control.value && control.value != "") {
                    let trimedvalue = control.value.replace(
                        /[^a-zA-Z0-9._%+-+@]/gm,
                        ""
                    );
                    control.setValue(trimedvalue);
                }
            }, 10);
        }
    };
}

export function numbersOnly(): ValidatorFn {
    return (control: AbstractControl): any => {
        if (typeof window !== "undefined") {
            window.setTimeout(() => {
                if (control.value && control.value != "") {
                    let trimedvalue = control.value.replace(/\D/g, "");
                    control.setValue(trimedvalue);
                }
            }, 10);
        }
    };
}
export function phoneNumberValidation(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            let max = 10;
            if (control.value && control.value != "") {
                let trimedvalue = control.value.replace(/\D/g, "");
                if (control.value.length >= max) {
                    trimedvalue = trimedvalue.substr(0, max);
                }
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function alphaOnly(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != "") {
                let trimedvalue = control.value.replace(/[^a-zA-Z]/g, "");
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function alphaWithSpace(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != "") {
                let trimedvalue = control.value.replace(/[^a-zA-Z ]/g, "");
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function alphaWithSlash(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != "") {
                // Allow alphabetic characters, /, and -
                let trimmedValue = control.value.replace(/[^a-zA-Z/-]/g, "");
                control.setValue(trimmedValue);
            }
        }, 10);
    };
}
