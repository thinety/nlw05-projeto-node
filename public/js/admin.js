const socket = io();

let globalConnections = [];

socket.on('admin_list_all_users', (connections) => {
  globalConnections = connections;
  document.querySelector('#list_users').innerHTML = '';

  const template = document.querySelector('#template').innerHTML;

  connections.forEach(connection => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.querySelector('#list_users').innerHTML += rendered;
  });
});

function call(id) {
  const connection = globalConnections.find(connection => connection.socket_id === id);

  const template = document.querySelector('#admin_template').innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  document.querySelector('#supports').innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit('admin_user_in_support', params);

  socket.emit('admin_list_messages_by_user', params, (messages) => {
    const divMessages = document.querySelector(`#allMessages${connection.user_id}`);

    messages.forEach(message => {
      const div = document.createElement('div');

      if (message.admin_id === null) {
        div.className = 'admin_message_client';

        div.innerHTML = `<span>${connection.user.email}</span>`;
        div.innerHTML += `<span>${message.text}</span>`;
        div.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;
      } else {
        div.className = 'admin_message_admin';

        div.innerHTML = `Atendente: <span>${message.text}</span>`;
        div.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;
      }

      divMessages.appendChild(div);
    });
  });
}

function sendMessage(id) {
  const input = document.querySelector(`#send_message_${id}`);

  const params = {
    text: input.value,
    user_id: id,
  };

  socket.emit('admin_send_message', params);

  const divMessages = document.querySelector(`#allMessages${id}`);

  const div = document.createElement('div');
  div.className = 'admin_message_admin';
  div.innerHTML = `Atendente: <span>${params.text}</span>`;
  div.innerHTML += `<span class="admin_date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}</span>`;

  divMessages.appendChild(div);

  input.value = '';
}

socket.on('admin_receive_message', (message) => {
  const connection = globalConnections.find(connection => connection.socket_id === message.socket_id);

  const divMessages = document.querySelector(`#allMessages${connection.user_id}`);

  const div = document.createElement('div');
  div.className = 'admin_message_client';
  div.innerHTML = `<span>${connection.user.email}</span>`;
  div.innerHTML += `<span>${message.message.text}</span>`;
  div.innerHTML += `<span class="admin_date">${dayjs(message.message.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>`;

  divMessages.appendChild(div);
});
