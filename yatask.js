function exchange(){
    var multiply;
    switch( this.price.charAt( 0 ))
    {
        case '€':
            multiply = 40.725;
            break;
        case '¥':
            multiply = 0.415;
            break;
        default:
            multiply = 1;
    }
    return '₷' + parseInt( this.price.substring( 1 ) * multiply * 100 ) / 100;
}
/**
 * Создает экземпляр Машины
 * @this {Car}
 * @param {string} manufacturer Производитель
 * @param {string} model Модель
 * @param {number} year Год производство
 */
function Car(manufacturer, model, year) {
    this.manufacturer = manufacturer;
    this.model = model;
    this.year = !!year ? year : (new Date()).getFullYear();
    this.price = null;
    this.toString = function() {
        return this.getInfo();
    }
    this.getInfo = function() {
        return [this.manufacturer, this.model, this.year].join( ' ' );
    }
    this.getDetailedInfo = function() {
        return 'Производитель: ' + this.manufacturer + '. Модель: ' + this.model + '. Год: ' + this.year;
    }
    this.setPrice = function(price) {
        this.price = price;
    }
}
// @TODO: если конструктор вызывается без указания текущего года, то подставлять текущий
// @TODO: реализовать методы вывода информации о машине: 
// console.log('Car: ' + bmw); // Car: BMW X5 2010
// console.log(bmw.getInfo()); // BMW X5 2010
// console.log(bmw.getDetailedInfo()); // Производитель: BMW. Модель: X5. Год: 2010

var bmw = new Car("BMW", "X5", 2010),
    audi = new Car("Audi", "Q5", 2012),
    toyota = new Car("Toyota", "Camry");


/**
 * Создает экземпляр Автосалона
 * @this {CarDealer}
 * @param {string} name Название автосалона
 */
function CarDealer(name) {
    this.name = name;
    this.cars = [];
    this.add = function() {
        for (var i = 0, l = arguments.length; i < l; i++ ) {
            this.cars.push( arguments[ i ]);
        }
        return this;
    }
    this.setPrice = function( carId, cost ){
        for ( var i = 0, l = this.cars.length; i < l; i++ ) {
            with (this.cars[ i ])
                if ([manufacturer, model, year].join(' ') === carId){
                    setPrice(cost);
                    break;
                }         
        }
        return this;
    }
    this.list = function(){
        var s = '';
        for ( var i = 0, l = this.cars.length; i < l; i++ ) {
            s += (s ? ', ' : '') + this.cars[ i ].getInfo();
        }
        return s;
    }
    this.listByCountry = function( country ){
        var s = '';
        for ( var i = 0, l = this.cars.length; i < l; i++ ) {
            if(country === getCountry.call(this.cars[ i ])) {
                s += (s ? ', ' : '') + this.cars[ i ].getInfo();
            }
        }
        return s;
    }
    this.pricelist = function(){
        var s = '';
        for ( var i = 0, l = this.cars.length; i < l; i++ ) {
            s += (s ? ', ' : '') + this.cars[ i ].getInfo() + ' - ' + exchange.call( this.cars[ i ]);
        }
        return s;
    }
}

var yandex = new CarDealer('Яндекс.Авто');

// @TODO: реализовать метод добавления машин в автосалон. Предусмотреть возможность добавления одной машины, нескольких машин.
yandex
    .add(toyota)
    .add(bmw, audi);

// @TODO: реализовать метод установки цены на машину
/**
 * Установить цену на машину
 * @param {string} car идентификатор машины
 * @param {string} price стоимость
 */
// идентификатор машины составляется следующим образом "производитель модель год"
// стоимость машины может быть задана в двух валютах: йена и евро.
yandex
    .setPrice('BMW X5 2010', '€2000')
    .setPrice('Audi Q5 2012', '€3000')
    .setPrice('Toyota Camry 2012', '¥3000');

// @TODO: реализовать вывод списка автомобилей в продаже, с фильтрацией по стране производителю, используя метод getCountry:
function getCountry() {
    switch (this.manufacturer.toLowerCase()) {
        case 'bmw':
        case 'audi':
            return 'Germany';

        case 'toyota':
            return 'Japan';
    }
}

yandex.list(); //BMW X5 2010, Audi Q5 2012, Toyota Camry 2012
yandex.listByCountry('Germany'); //BMW X5 2010, Audi Q5 2012

// @TODO: бонус! выводить список машин с ценой в рублях.