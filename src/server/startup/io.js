module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('Connected to a client');

        socket.on('newLogin', (data) => {
            // console.log(data);
            socket.emit('newMessage', { from: 'admin@howfinder.ru', title: 'Welcome to howfinder', text: 'Bla bla bla...', createdAt: Date.now()})
        });
    });
};
