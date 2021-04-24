let socket = null;
let admin_socket_id = null;
let user_email = null;

document.querySelector("#start_chat").addEventListener("click", (event) => {
  const chat_help = document.querySelector('#chat_help');
  chat_help.style.display = 'none';

  const chat_in_support = document.querySelector('#chat_in_support');
  chat_in_support.style.display = 'block';

  socket = io();

  const email = document.querySelector('#email').value;
  user_email = email;
  const text = document.querySelector('#txt_help').value;

  socket.on('connect', () => {
    const params = {
      email, text,
    };

    socket.emit('client_first_access', params, (cb, err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(cb);
      }
    });
  });

  socket.on('client_list_all_messages', (messages) => {
    const template_client = document
      .querySelector('#message-user-template')
      .innerHTML;

    const template_admin = document
      .querySelector('#admin-template')
      .innerHTML;

    messages.forEach(message => {
      if (message.admin_id === null) {
        const rendered = Mustache.render(template_client, {
          message: message.text,
          email,
        });

        document.querySelector('#messages').innerHTML += rendered;
      } else {
        const rendered = Mustache.render(template_admin, {
          message_admin: message.text,
        });

        document.querySelector('#messages').innerHTML += rendered;
      }
    });
  });

  socket.on('admin_send_to_client', (message) => {
    admin_socket_id = message.socket_id;

    const template_admin = document
      .querySelector('#admin-template')
      .innerHTML;

    const rendered = Mustache.render(template_admin, {
      message_admin: message.text,
    });

    document.querySelector('#messages').innerHTML += rendered;
  });
});

document.querySelector('#send_message_button').addEventListener('click', (event) => {
  const input = document.querySelector('#message_user');

  const params = {
    text: input.value,
    admin_socket_id,
  };

  socket.emit('client_send_to_admin', params);

  const template_client = document
    .querySelector('#message-user-template')
    .innerHTML;

  const rendered = Mustache.render(template_client, {
    message: params.text,
    email: user_email,
  });

  document.querySelector('#messages').innerHTML += rendered;

  input.value = '';
});
