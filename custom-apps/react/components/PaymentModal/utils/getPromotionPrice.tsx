export const cartSimulation = async (
  selectedItem: any,
  setPrice: React.Dispatch<React.SetStateAction<number | undefined>>,
  paymentSystemId: string,
  quantity: number = 1
) => {
  const itemId = selectedItem?.itemId ?? selectedItem?.id

  if (selectedItem) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: itemId,
            quantity,
            seller: '1',
          },
        ],
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

    await fetch(
      '/api/checkout/pub/orderForms/simulation?RnbBehavior=0',
      options
    )
      .then(res => res.json())
      .then(data => {
        const unitMultiplier = data.items[0].unitMultiplier ?? 1
        setPrice(data.paymentData.payments[0].value / unitMultiplier)
      })
  }
}
