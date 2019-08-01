export default function createWebSocketPlugin (socket) {
    return store => {
      // TODO implement this
      socket.on('data', data => {
        store.commit('receiveData', data)
      })
      store.subscribe(mutation => {
        if (mutation.type === 'UPDATE_DATA') {
          socket.emit('update', mutation.payload)
        }
      })
    }
  }