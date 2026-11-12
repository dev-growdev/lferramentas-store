export const pdpInteractiveCouponSchema = {
  title: 'Cupom interativo PDP',
  description:
    'Cupom exibido na PDP e aplicado no carrinho ao clicar. É exibido o cupom ativo, dentro do agendamento e vinculado a uma coleção do produto.',
  type: 'object',
  properties: {
    coupons: {
      title: 'Lista de cupons',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Título',
            type: 'string',
            description:
              'Opcional. Usado apenas para identificar o cupom na lista do Site Editor.',
            default: 'Cupom',
          },
          isActive: {
            title: 'Exibir cupom',
            type: 'boolean',
            default: true,
          },
          couponCode: {
            title: 'Código do cupom',
            type: 'string',
            description:
              'Deve ser igual ao código cadastrado em Promoções & Taxas.',
            default: '',
          },
          priority: {
            title: 'Prioridade',
            type: 'number',
            description:
              'Se mais de um cupom valer para o mesmo produto, o de maior prioridade é exibido.',
            default: 0,
          },
          withoutLink: {
            title: 'Exibir em todos os produtos (ignorar coleções)',
            type: 'boolean',
            default: false,
          },
          scheduling: {
            title: 'Agendamento',
            type: 'object',
            properties: {
              dateStart: {
                title: 'Exibir a partir de',
                description:
                  'Data e hora de início da exibição do cupom. Deixe vazio para exibir sempre.',
                type: 'string',
                format: 'date-time',
                widget: {
                  'ui:widget': 'datetime',
                },
              },
              dateEnd: {
                title: 'Expirar em',
                description:
                  'Data e hora em que o cupom deixará de ser exibido. Deixe vazio para não expirar.',
                type: 'string',
                format: 'date-time',
                widget: {
                  'ui:widget': 'datetime',
                },
              },
            },
          },
          collections: {
            title: 'Vinculações por coleção',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                __editorItemTitle: {
                  title: 'Título',
                  type: 'string',
                  description:
                    'Opcional. Usado apenas para identificar a coleção na lista.',
                  default: 'coleção',
                },
                value: {
                  title: 'Id da coleção',
                  type: 'number',
                  description:
                    'O cupom será exibido nos produtos que pertencem a esta coleção.',
                },
              },
            },
          },
        },
      },
    },
  },
}
