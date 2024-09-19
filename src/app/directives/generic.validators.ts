import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numbersOnly(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^0-9]/gm, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function numbersandDot(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                if (control.value[0] == 0) {
                    control.setValue('');
                }
                let dotCount = (control.value.match(/\./g) || []).length;
                let trimedvalue = control.value.replace(/[^.0-9]/gm, '');
                if (dotCount > 1) {
                    let trimedvalue = control.value.slice(0, -1);
                    control.setValue(trimedvalue);
                } else {
                    control.setValue(trimedvalue);
                }
            }
        }, 10);
    };
}
export function numbersAndComma(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                if (control.value[0] == 0) {
                    control.setValue('');
                }
                let dotCount = (control.value.match(/[^,0-9]+/g) || []).length;
                let trimedvalue = control.value.replace(/[^,0-9]/gm, '');
                if (dotCount > 1) {
                    let trimedvalue = control.value.slice(0, -1);
                    control.setValue(trimedvalue);
                } else {
                    control.setValue(trimedvalue);
                }
            }
        }, 10);
    };
}
export function notallowzeroFirst(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                if (control.value[0] == 0) {
                    control.setValue('');
                }
                let trimedvalue = control.value.replace(/[^0-9]/gm, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function required(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value ? null : { required: true };
    };
}

export function alphaOnly(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-zA-Z]/g, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function alphaWithSpace(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-zA-Z ]/g, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function alphaWithSpaceandDot(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-zA-Z .]/g, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function alphaNumericWithSpace(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(
                    /[^a-z0-9A-Z\s ]/gm,
                    ''
                );
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function alphaNumeric(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-zA-Z0-9 .]/gm, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function alphaNumericOnly(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-zA-Z0-9]/gm, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function addressValidations(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(
                    /[^a-zA-Z0-9,/\s ]/gm,
                    ''
                );
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}

export function numberAndSlash(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^0-9/]/gm, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function emailValidations(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-z0-9-._@]/gm, '');
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function policyNumberLengthValidations(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            let max = 14;
            if (control.value && control.value != '') {
                let trimedvalue = control.value.replace(/[^a-zA-Z0-9]/gm, '');
                if (control.value.length >= max) {
                    trimedvalue = trimedvalue.substr(0, max);
                }
                control.setValue(trimedvalue);
            }
        }, 10);
    };
}
export function inputLengthValidations(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            let max = 64;
            if (control.value && control.value != '') {
                if (control.value.length >= max) {
                    let trimedvalue = control.value.substr(0, max);
                    control.setValue(trimedvalue);
                }
            }
        }, 10);
    };
}

export function MultipleForPremiumValidations(): ValidatorFn {
    return (control: AbstractControl): any => {
        let getValue = control.value;
        if (getValue && getValue.length > 4) {
            if (getValue % 1000 > 0) {
                const isValid = getValue % 1000 > 0;
                return isValid
                    ? { myCustomError: 'This value is invalid' }
                    : '';
            }
        }
        return false;
    };
}

export function repeatedCharacters(): ValidatorFn {
    return (control: AbstractControl): any => {
        setTimeout(() => {
            if (control.value && control.value != '') {
                let zeroCount = (control.value.match(/0/g) || []).length;
                let oneCount = (control.value.match(/1/g) || []).length;
                let twoCount = (control.value.match(/2/g) || []).length;
                let threeCount = (control.value.match(/3/g) || []).length;
                let fourCount = (control.value.match(/4/g) || []).length;
                let fiveCount = (control.value.match(/5/g) || []).length;
                let sixCount = (control.value.match(/6/g) || []).length;
                let sevenCount = (control.value.match(/7/g) || []).length;
                let eightCount = (control.value.match(/8/g) || []).length;
                let nineCount = (control.value.match(/9/g) || []).length;
                if (control.value[0] < 6) {
                    control.setValue('');
                }
                if (
                    zeroCount >= 10 ||
                    oneCount >= 10 ||
                    twoCount >= 10 ||
                    threeCount >= 10 ||
                    fourCount >= 10 ||
                    fiveCount >= 10 ||
                    sixCount >= 10 ||
                    sevenCount >= 10 ||
                    eightCount >= 10 ||
                    nineCount >= 10
                ) {
                    control.setValue('');
                }
            }
        }, 10);
    };
}

export function resetFormFields(element: any) {
    let elements = element.querySelectorAll('.form-control');
    elements.forEach((ele: any) => {
        ele.closest('.form-group').classList.remove('focused');
    });
}