 export const HtmlElements = {
    createInput: (type, name, id, className=null, value=null, placeholder=null, autofocus=null, checked=false, disabled=false, readonly=false, required=false) => {
        const input = document.createElement('input');

        // REQUIRED PARAMETERS
        input.type = type;
        input.name = name;
        input.id = id;

        // OPTIONAL PARAMETERS
        input.value = value;
        input.className = className;
        input.placeholder = placeholder;
        if (autofocus) {
            input.setAttribute('autofocus','');
        }
        if (checked) {
            input.setAttribute('checked','');
        }
        if (disabled) {
            input.setAttribute('disabled','');
        }
        if (readonly) {
            input.setAttribute('readonly','');
        }
        if (required) {
            input.setAttribute('required','');
        }
        return input;
    },
    createLabel: (input_id, textContent, className=null, form_id=null) => {
        const label = document.createElement('label');

        // REQUIRED PARAMETERS
        label.setAttribute('for', input_id);
        label.textContent = textContent;

        // OPTIONAL PARAMETERS
        label.className = className;
        if (form_id) {
            label.form = form_id;
        }

        return label;
    },
    createButton: (type, buttonText, id=null, className=null, disabled=null) => {
        const button = document.createElement('button');

        //REQUIRED PARAMETERS
        button.type = type;
        button.innerHTML = buttonText;

        // OPTIONAL PARAMETERS
        button.id = id;
        button.className = className;
        if (disabled) {
            button.setAttribute('disabled','');
        }

        return button;
    },
    createDiv: (id=null, className=null) => {
        const div = document.createElement('div');

        // OPTIONAL PARAMETERS
        div.id = id;
        div.className = className;

        return div;
    }
}