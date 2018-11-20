const socket = io();

socket.on('connect', () => {
   console.log('Connected to server!');


});

socket.on('newMessage', (data) => {
    console.log(data);
});

socket.emit('newLogin', {user: {username:'dddd'}});

socket.emit('newRegister', {user: {username:'dddd'}});
socket.emit('newMessage', {user: {username:'dddd'}});

socket.on('disconnect', () => {
    console.log('Disconnected from server!');
});