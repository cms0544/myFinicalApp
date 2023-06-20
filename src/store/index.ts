
import {createStore} from 'vuex'
import user from './modules/user'
import cost from './modules/cost'
import currentPrice from './modules/currentPrice'
export default createStore({
    modules:{
        user,
        cost,
        currentPrice
    }
});
