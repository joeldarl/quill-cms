
// var fieldTypes = !{JSON.stringify(fieldTypes)};

function fieldform(fieldTypes) {
    var i = 0;

    // Add a row to custom fields
    function addField(parentId, name, type) {

        // Putting together the select field type dropdown
        let select = `<select name="fields[${i}][field_type]">`
        fieldTypes.forEach((fieldType) => {
            select += `<option value=`+fieldType.name+`>`+fieldType.name+`</option>`
        });
        select += `</select>`;

        // Inserting select field type into the rest of the template
        let template = `
            <div class="item row">
                <div>
                    <input type="text" name="fields[${i}][field_name]">
                </div>
                <div>
                `+select+`
                </div>
                <div>
                    <a onclick='removeField()'>Delete</a>
                </div>
            </div>
        `
        let parent = document.getElementById(parentId);
        let div = document.createElement('div');
        div.innerHTML = template;
        parent.append(div);
        i++;
    }

    function removeField(element) {
        var row = element.closest('.row');
        row.remove();
    }

    var submit = document.getElementById('post-type-form');
    submit.onsubmit = function() {
        document.getElementById('type-template').remove();
    }
}
