// Supabase Edge Function: Create Mercado Pago Payment Preference
// Deploy with: supabase functions deploy create-payment

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') || '';

interface MPItem {
  title: string;
  unit_price: number;
  quantity: number;
  currency_id: string;
  picture_url?: string;
}

interface RequestBody {
  items: MPItem[];
  shipping_cost: number;
  payer?: {
    address?: {
      street_name?: string;
      street_number?: number;
      zip_code?: string;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const body: RequestBody = await req.json();

    const preference = {
      items: body.items,
      shipments: {
        cost: body.shipping_cost,
        mode: 'not_specified',
      },
      payer: body.payer || {},
      back_urls: {
        success: 'tiendaapp://payment/success',
        failure: 'tiendaapp://payment/failure',
        pending: 'tiendaapp://payment/pending',
      },
      auto_return: 'approved',
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mp-webhook`,
    };

    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(preference),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mercado Pago error: ${error}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        id: data.id,
        initPoint: data.init_point,
        sandboxInitPoint: data.sandbox_init_point,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
});
