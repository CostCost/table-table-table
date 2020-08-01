import element from '../database/element';
import {dark as categoryColorsDark, light as categoryColorsLight} from '../enums/category';

class ElementService {
    constructor(){
    }

    getAllBaseInfo(){
        return element.base;
    }

    getBaseInfo(number){
        return element.base[number];
    }

    getCategoryColor(number){
        let base = element.base[number];
        if(!base){
            return '';
        }
        let category = base.category;
        let isDark = true;
        return isDark ? categoryColorsDark[category] : categoryColorsLight[category];
    }
//=-=========-=-===============

    getSize(){
        if(!this._size){
            this._size = Object.keys(element.base).length;
        }
        return this._size;
    }

    getName(number){
        return names[number-1];
    }

    getSymbol(number){
        return symbols[number-1];
    }

    getNumberByPos(type, x, y){
        return positions[x+','+y];
    }

    getCategory(number){
        return categorys[number-1];
    }

    getCategoryOptions(){
        return Object.keys(categoryColorsDark);
    }

    getElementDetail(number){
        return {
            id: number,
            base: element.base[number],
            overview: element.overview[number],
            props: element.props[number],
            therm: element.therm[number],
            atomic: element.atomic[number],
            electrom: element.electrom[number],
            grid: element.grid[number],
            addition: element.addition[number],
            reactivity: element.reactivity[number],
            nuclear: element.nuclear[number],
            preval: element.preval[number],
        }
    }
}

export default new ElementService();