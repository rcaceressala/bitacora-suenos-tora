const LS_API = 'https://api.lemonsqueezy.com/v1'

async function lsFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${LS_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Lemon Squeezy ${res.status}: ${text}`)
  }
  return res.json()
}

export async function createCheckoutUrl(userEmail: string, userId: string): Promise<string> {
  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: userEmail,
          custom: { user_id: userId },
        },
        product_options: {
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          receipt_link_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        },
      },
      relationships: {
        store: {
          data: { type: 'stores', id: String(process.env.LEMONSQUEEZY_STORE_ID) },
        },
        variant: {
          data: { type: 'variants', id: String(process.env.LEMONSQUEEZY_VARIANT_ID) },
        },
      },
    },
  }

  const json = await lsFetch('/checkouts', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  return json.data.attributes.url as string
}
