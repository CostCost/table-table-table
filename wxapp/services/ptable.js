import ptable from '../database/ptable';
import util from '../utils/util';

class PtableService {
    constructor(){
    }

    getLong(){
        return ptable.long;
    }

    getShort(){
        return ptable.short;
    }
}

export default new PtableService();