import db_element from '../../../../database/element';
import {dark as CatColor} from '../../../../enums/category';
var atomString = ""
var badData = false
var numAtoms = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
var ANofAtom = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
var numElems = ""

function getInfoBySymbol(symbol){
    let number;
    for(let key in db_element.base){
        if(db_element.base[key].symbol == symbol){
            number = key;
            break;
        }
    }
    return {
        name: db_element.base[number].name,
        color: CatColor[db_element.base[number].category]
    }
    // db_element
}

function parseFormula(formula) {
    var c = 0, x = 0, y = 0, c1 = 0, marker1 = 0, marker2 = -1, loopCount = 0
    var multiplier = 1
    var a1 = new Array(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    var a2 = new Array(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    while (c <= formula.length - 1 && !badData) {
        var AN = findAN(formula.substring(c, c + 2))
        if (AN == -1) {
            AN = findAN(formula.substring(c, c + 1))
            y = 1
        }
        else y = 2
        if (AN > -1) {
            marker2 = -1
            for (var c2 = 0; c2 <= 9; c2++) {
                if (a2[c2] == AN) {
                    marker2 = c2; break
                }
            }
            if (marker2 >= 0) { marker1 = marker2; loopCount -= 1 }
            else marker1 = loopCount
            c += y
            a2[marker1] = AN
            var OK = true
            var c3 = 0
            while (OK && c + c3 <= formula.length - 1) {
                AN = findNum(formula.substring(c + c3, c + c3 + 1))
                if (AN >= 0) c3++; else OK = false
            }
            if (c3 > 0) {
                if (marker2 >= 0) {
                    a1[marker1] += parseInt(formula.substring(c, c + c3)) * multiplier
                }
                else {
                    a1[marker1] = parseInt(formula.substring(c, c + c3)) * multiplier
                }
            }
            else {
                if (marker2 >= 0) a1[marker1] += 1 * multiplier
                else a1[marker1] = 1 * multiplier
            }
            c += c3;
            loopCount++
        }
        else {
            AN = "[]().".indexOf(formula.substring(c, c + 1));
            if (AN == -1) { badData = true; break }
            if (AN == 0 || AN == 2) {
                if (AN == 2) {
                    var zz = 0
                    for (x = c; x <= formula.length - 1; x++) {
                        if (formula.substring(x, x + 1) == ")") { zz = x; break }
                    }
                }
                else {
                    for (x = c; x <= formula.length - 1; x++) {
                        if (formula.substring(x, x + 1) == "]") { zz = x; break }
                    }
                }
                var c4 = 1; OK = true
                while (OK && zz + c4 <= formula.length - 1) {
                    var AN1 = findNum(formula.substring(zz + c4, zz + c4 + 1))
                    if (AN1 >= 0) c4++; else OK = false
                }
                if (c4 > 1) {
                    var z = parseInt(formula.substring(1 + zz, c4 + zz));
                    multiplier = multiplier * z
                }
                c++
            }
            if (AN == 1 || AN == 3) {
                var c5 = 1; OK = true
                while (OK && c + c5 <= formula.length - 1) {
                    var AN1 = findNum(formula.substring(c + c5, c + c5 + 1))
                    if (AN1 >= 0) c5++; else OK = false
                }
                if (c5 > 1) {
                    multiplier =
                        Math.round(multiplier /
                            parseInt(formula.substring(c + 1, c + c5)))
                }
                c += c5
            }
            if (AN == 4) {
                var c6 = 1; OK = true
                while (OK && c + c6 <= formula.length - 1) {
                    var AN1 = findNum(formula.substring(c + c6, c + c6 + 1))
                    if (AN1 >= 0) c6++; else OK = false
                }
                if (c6 > 1) {
                    multiplier *= parseInt(formula.substring(c + 1, c + c6))
                }
                c += c6
            }
        }
    }
    numElems = loopCount - 1
    for (var i = 0; i <= numElems; i++) {
        numAtoms[i] = a1[i]
        ANofAtom[i] = a2[i]
    }
    if (badData == true) { return true; }
}

function findAN(aSym) {
    var AN = 0
    if (aSym.length == 1) aSym += "*"
    var x = atomString.indexOf(aSym)
    AN = (x == -1) ? x : (x / 2) + 1
    return AN
}

function findNum(ch) {
    var numstring = "0123456789"
    var x = numstring.indexOf(ch)
    return x
}

function calcMolarMass() {
    var MM = 0
    for (var c = 0; c <= numElems; c++) {
        var x = ANofAtom[c]
        MM += a[x]["mass"] * numAtoms[c]
    }
    MM = Math.round(MM * 100) / 100
    return MM;
}

function atomArray(symbol, mass) {
    this.symbol = symbol
    this.mass = mass
}

function makeArray(arraySize) {
    this.length = arraySize
    for (var c = 1; c <= arraySize; c++) {
        this[c] = 0
    }
    return this
}

var a = new makeArray(127);
for(var i=1; i<=127; i++){
    var sy = db_element.base[i].symbol;
    var we = Number(db_element.props[i].atomic_weight);
    a[i] = new atomArray(sy, we);
}
// a[1] = new atomArray("H", 1.0079)
// a[2] = new atomArray("He", 4.0026)
// a[3] = new atomArray("Li", 6.941)
// a[4] = new atomArray("Be", 9.0122)
// a[5] = new atomArray("B", 10.811)
// a[6] = new atomArray("C", 12.0107)
// a[7] = new atomArray("N", 14.0067)
// a[8] = new atomArray("O", 15.9994)
// a[9] = new atomArray("F", 18.9984)
// a[10] = new atomArray("Ne", 20.1797)
// a[11] = new atomArray("Na", 22.9897)
// a[12] = new atomArray("Mg", 24.305)
// a[13] = new atomArray("Al", 26.9815)
// a[14] = new atomArray("Si", 28.0855)
// a[15] = new atomArray("P", 30.9738)
// a[16] = new atomArray("S", 32.065)
// a[17] = new atomArray("Cl", 35.453)
// a[18] = new atomArray("Ar", 39.948)
// a[19] = new atomArray("K", 39.0983)
// a[20] = new atomArray("Ca", 40.078)
// a[21] = new atomArray("Sc", 44.9559)
// a[22] = new atomArray("Ti", 47.867)
// a[23] = new atomArray("V", 50.9415)
// a[24] = new atomArray("Cr", 51.9961)
// a[25] = new atomArray("Mn", 54.938)
// a[26] = new atomArray("Fe", 55.845)
// a[27] = new atomArray("Co", 58.9332)
// a[28] = new atomArray("Ni", 58.6934)
// a[29] = new atomArray("Cu", 63.546)
// a[30] = new atomArray("Zn", 65.39)
// a[31] = new atomArray("Ga", 69.723)
// a[32] = new atomArray("Ge", 72.64)
// a[33] = new atomArray("As", 74.9216)
// a[34] = new atomArray("Se", 78.96)
// a[35] = new atomArray("Br", 79.904)
// a[36] = new atomArray("Kr", 83.8)
// a[37] = new atomArray("Rb", 85.4678)
// a[38] = new atomArray("Sr", 87.62)
// a[39] = new atomArray("Y", 88.9059)
// a[40] = new atomArray("Zr", 91.224)
// a[41] = new atomArray("Nb", 92.9064)
// a[42] = new atomArray("Mo", 95.94)
// a[43] = new atomArray("Tc", 98)
// a[44] = new atomArray("Ru", 101.07)
// a[45] = new atomArray("Rh", 102.9055)
// a[46] = new atomArray("Pd", 106.42)
// a[47] = new atomArray("Ag", 107.8682)
// a[48] = new atomArray("Cd", 112.411)
// a[49] = new atomArray("In", 114.818)
// a[50] = new atomArray("Sn", 118.71)
// a[51] = new atomArray("Sb", 121.76)
// a[52] = new atomArray("Te", 127.6)
// a[53] = new atomArray("I", 126.9045)
// a[54] = new atomArray("Xe", 131.293)
// a[55] = new atomArray("Cs", 132.9055)
// a[56] = new atomArray("Ba", 137.327)
// a[57] = new atomArray("La", 138.9055)
// a[58] = new atomArray("Ce", 140.116)
// a[59] = new atomArray("Pr", 140.9077)
// a[60] = new atomArray("Nd", 144.24)
// a[61] = new atomArray("Pm", 145)
// a[62] = new atomArray("Sm", 150.36)
// a[63] = new atomArray("Eu", 151.964)
// a[64] = new atomArray("Gd", 157.25)
// a[65] = new atomArray("Tb", 158.9253)
// a[66] = new atomArray("Dy", 162.5)
// a[67] = new atomArray("Ho", 164.9303)
// a[68] = new atomArray("Er", 167.259)
// a[69] = new atomArray("Tm", 168.9342)
// a[70] = new atomArray("Yb", 173.04)
// a[71] = new atomArray("Lu", 174.967)
// a[72] = new atomArray("Hf", 178.49)
// a[73] = new atomArray("Ta", 180.9479)
// a[74] = new atomArray("W", 183.84)
// a[75] = new atomArray("Re", 186.207)
// a[76] = new atomArray("Os", 190.23)
// a[77] = new atomArray("Ir", 192.217)
// a[78] = new atomArray("Pt", 195.078)
// a[79] = new atomArray("Au", 196.9665)
// a[80] = new atomArray("Hg", 200.59)
// a[81] = new atomArray("Tl", 204.3833)
// a[82] = new atomArray("Pb", 207.2)
// a[83] = new atomArray("Bi", 208.9804)
// a[84] = new atomArray("Po", 209)
// a[85] = new atomArray("At", 210)
// a[86] = new atomArray("Rn", 222)
// a[87] = new atomArray("Fr", 223)
// a[88] = new atomArray("Ra", 226)
// a[89] = new atomArray("Ac", 227)
// a[90] = new atomArray("Th", 232.0381)
// a[91] = new atomArray("Pa", 231.0359)
// a[92] = new atomArray("U", 238.0289)
// a[93] = new atomArray("Np", 237)
// a[94] = new atomArray("Pu", 244)
// a[95] = new atomArray("Am", 243)
// a[96] = new atomArray("Cm", 247)
// a[97] = new atomArray("Bk", 247)
// a[98] = new atomArray("Cf", 251)
// a[99] = new atomArray("Es", 252)
// a[100] = new atomArray("Fm", 257)
// a[101] = new atomArray("Md", 258)
// a[102] = new atomArray("No", 259)
// a[103] = new atomArray("Lr", 262)
// a[104] = new atomArray("Rf", 261)
// a[105] = new atomArray("Db", 262)
// a[106] = new atomArray("Sg", 266)
// a[107] = new atomArray("Bh", 264)
// a[108] = new atomArray("Hs", 277)
// a[109] = new atomArray("Mt", 268)

function makeAtomString() {
    for (var c = 1; c <= a.length; c++) {
        atomString += a[c]["symbol"]
        if (a[c]["symbol"].length == 1) atomString += "*"
    }
    return atomString
}

function writeOut(formula) {
    badData = false;
    var numCols = 5
    var numSignificance = 6

    makeAtomString()
    let err = parseFormula(formula)
    if(err){
        console.log('解析错误');
        return null;
    }
    if (badData == false) {

        var MM = calcMolarMass()
        var weight = MM;
        console.log(weight);

        var arr = [];
        for (var i = 0; i <= numElems; i++) {
            var sub = {};
            for (var j = 0; j < numCols; j++) {

                if (j == 0) { 
                    sub['num'] = numAtoms[i];
                }
                else if (j == 1) { 
                    sub['symbol'] = a[ANofAtom[i]].symbol;
                    let info = getInfoBySymbol(sub['symbol']);
                    sub['name'] = info.name;
                    sub['color'] = info.color;
                }
                else if (j == 2) { 
                    sub['mass'] = Number(parseFloat(a[ANofAtom[i]].mass));
                }
                else if (j == 3) {
                    sub['mass_b'] = Number(parseFloat(a[ANofAtom[i]].mass * numAtoms[i] / MM * 100));
                }
                else if (j == 4) { 
                    sub['all_mass'] = Number(parseFloat(a[ANofAtom[i]].mass * numAtoms[i]));
                }
                else { 
                    // alert("This page operates incorrect. Please help Lenntech and report the failure.") 
                }
            }
            arr.push(sub);
        }
        return {
            weight: weight,
            list: arr
        };
    }
    else {
        return null;
    }
}

export default writeOut;