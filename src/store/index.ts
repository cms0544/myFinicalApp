
import {createStore} from 'vuex'
import user from './modules/user'
import cost from './modules/cost'
export default createStore({
    modules:{
        user,
        cost
    }
});
