import Translator from './components/Translator';

export default {
    install (Vue) {
        Vue.component('translator', Translator);
    }
}

export { Translator };
