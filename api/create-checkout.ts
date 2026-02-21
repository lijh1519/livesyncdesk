import type { VercelRequest, VercelResponse } from '@vercel/node';

// DodoPayments Product IDs (Live Mode)
const PRODUCT_MONTHLY = 'pdt_0NYxwtAgGYt36lCwS6LXW';
const PRODUCT_YEARLY = 'pdt_0NYxwxd1aqzuRrxe2CNzv';

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY || '';
const DODO_ENV = process.env.DODO_ENV || 'test_mode'; // 'test_mode' or 'live_mode'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, plan, returnUrl } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: 'Email and plan are required' });
    }

    const productId = plan === 'yearly' ? PRODUCT_YEARLY : PRODUCT_MONTHLY;
    
    const baseUrl = DODO_ENV === 'live_mode' 
      ? 'https://live.dodopayments.com' 
      : 'https://test.dodopayments.com';

    console.log('Checkout request:', { baseUrl, productId, email, env: DODO_ENV, hasApiKey: !!DODO_API_KEY });

    const response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DODO_API_KEY}`
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: { email },
        return_url: returnUrl || 'https://livesyncdesk.vercel.app/pricing?success=true',
        metadata: { user_email: email }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DodoPayments error:', response.status, errorText);
      return res.status(500).json({ 
        error: 'Failed to create checkout session',
        details: errorText,
        status: response.status
      });
    }

    const session = await response.json();
    
    return res.status(200).json({ 
      checkout_url: session.checkout_url,
      session_id: session.session_id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
