import axios from 'axios';

const profiles = {
    namespaced: true,
    state: {
        settings: {}
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        loadSettings: async function({ state }) {
            const response = await axios.get('/api/settings');
            state.settings = response.data;
            return state.settings;
        },
        storeSettings: async function({ state }, settings) {
            state.settings = settings;
            await axios.put('/api/settings', settings);
            return state.settings;
        }
    }
}

export default profiles;