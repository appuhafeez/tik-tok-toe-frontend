import { FormControl, ValidationErrors } from '@angular/forms';

export class EmptyValidator {
    

    // white space validation
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors{

        // check if string only contains whitespace
        if((control.value!=null) && (control.value.trim().length===0)){
            return {'notOnlyWhiteSpace':true};
        }else{
            // valid, return null
            return null;
        }
    }

}
