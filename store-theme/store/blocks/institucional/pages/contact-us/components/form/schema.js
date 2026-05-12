fetch('/api/dataentities/faleconoscolf/schemas/faleconoscolf', {
  method: 'PUT',
  headers: {
    'content-type': 'application/json', 
  },
  body: JSON.stringify({
    title: 'Fale Conosco',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Nome',
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'E-mail',
      },
      message: {
        type: 'string',
        title: 'Mensagem',
      },
    },
    required: ['name', 'email', 'message'],
    'v-indexed': ['name', 'email'],
    'v-security': {
      publicJsonSchema: true,
      allowGetAll: true,
      publicRead: ['name', 'email', 'message'],
      publicWrite: ['name', 'email', 'message'],
      publicFilter: ['name', 'email', 'message'],
    },
    'v-triggers': [
      {
        name: 'send-email',
        active: true,
        condition: 'email is not null',
        action: {
          type: 't-email',
          template: 'contact-customer-support-form',
          provider: 'default',
          replyTo: '{!email}',
          body: {
            to: ['contato@lfmaquinaseferramentas.com.br'],
            subject: 'Fale Conosco - LF',
            name: '{!name}',
            email: '{!email}',
            message: '{!message}',
          },
        },
      },
    ],
  }),
})
  .then((res) => res.json())
  .then((res) => console.log(res));
