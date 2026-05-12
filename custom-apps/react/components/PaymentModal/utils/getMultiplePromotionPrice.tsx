export const cartSimulationForMultipleItems = async (
  items: any,
  setPrices: React.Dispatch<React.SetStateAction<any | undefined>>,
  paymentSystemId: string
) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.vtex.ds.v10+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items,
      paymentData: {
        payments: [
          {
            paymentSystem: paymentSystemId,
            installments: 1,
          },
        ],
      },
    }),
  }

  const res = await fetch(
    '/api/checkout/pub/orderForms/simulation?RnbBehavior=0',
    options
  )
  const data = await res.json()
  setPrices(data)
}
