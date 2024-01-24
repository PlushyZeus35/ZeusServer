module.exports = class Finance{
    constructor(id, concept, amount, date, type, categories, shop){
        this.id = id;
        this.concept = concept;
        this.amount = amount;
        this.date = date;
        this.type = type;
        this.categories = categories;
        this.shop = shop;
    }

    hasValidProperties(){
        return this.concept && this.amount && this.isNumber(this.amount) && this.date && this.isValidISO8601Date(this.date) && this.type && this.categories && Array.isArray(this.categories) && this.shop
    }

    isValidISO8601Date(dateString) {
        // Expresión regular para validar el formato ISO 8601
        const regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[\+\-]\d{2}:\d{2})?)?$/;
    
        if (dateString.match(regex) === null) {
            return false; // No coincide con el formato ISO 8601
        }
    
        // Usar Date.parse para verificar si la fecha es válida
        const timestamp = Date.parse(dateString);
        if (isNaN(timestamp) === false) {
            return true; // La fecha es válida
        }
    
        return false; // Fecha inválida
    }

    isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    get properties(){
        let error;
        let errorMsg;
        if(!this.hasValidProperties()){
            error = true;
            errorMsg = 'Null in mandatory field'
        }
        return {
            id: this.id,
            concept: this.concept,
            amount: this.amount,
            date: this.date,
            type: this.type,
            categories: this.categories,
            shop: this.shop,
            error,
            errorMsg
        }
    }

    get notionProperties(){
        const tags = []
        for(let fTag of this.categories){
            tags.push({name: fTag});
        }

        return {
            Concepto: {
                title: [{
                    text: {content: this.concept}
                }]
            },'Fecha valor': {
                "date": {
                    "start": this.date
                }
            }, Cantidad: {
                "number": this.amount
            }, Tipología: {
                "select": {
                    "name": this.type
                }
            }, Tienda: {
                "select": {
                    "name": this.shop
                }
            }, Categorías: {
                "multi_select": tags
            }
        }
    }
}