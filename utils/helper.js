const chunkStorage = {};

const ChunkHelper = {
    add(k, c){
        if(!chunkStorage[k]) chunkStorage[k] = c;
    },
    set(k, c){
        chunkStorage[k] = c;
    },
    get(k){
        return chunkStorage[k] ? chunkStorage[k] : null;
    },
    remove(k){
        delete chunkStorage[k]
    },
    load(k){
        const loadable = chunkStorage.get(k);
        if(loadable){
            return loadable.load().then(m => {
                const c = m.default ? m.default : m;
                loadable.error = false;
                loadable.component = c;
                return loadable;
            }).catch(err => {
                console.log('loadable error', err);
                loadable.error = true;
                loadable.component = null
                throw err;
            })
        } else {
            const error = new Error('loadable is null');
            return Promise.reject(error);
        }
    },
};

    export default ChunkHelper;
