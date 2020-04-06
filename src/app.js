import Vue from 'vue';
import App from './App.vue';
import createStore from './vuex/store';
import createRouter from './router';
import { sync } from 'vuex-router-sync';


function createApp () {
    const store = createStore();
    const router = createRouter();
    sync(store, router);
    const app = new Vue({
      router,
      store,
      render: h => h(App)
    })
    return { app, router, store };
};

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
    router.beforeResolve((to, from, next) => {
      const matched = router.getMatchedComponents(to);
      const prevMatched = router.getMatchedComponents(from);
  
      let diffed = false;
      const activated = matched.filter((c, i) => {
        return diffed || (diffed = (prevMatched[i] !== c))
      });
      if (!activated.length) 
        return next();
      Promise.all(activated.map(c => {
        if (c.asyncData) 
            return c.asyncData({ store, route: to });
      })).then(() => {
        next();
      }).catch(next);
    });
    app.$mount('#app');
  })