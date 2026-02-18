import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Supabase 配置
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''; // 需要 service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Paddle Webhook 签名验证
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || '';

function verifyPaddleSignature(payload: string, signature: string): boolean {
  if (!PADDLE_WEBHOOK_SECRET) return true; // 开发环境跳过验证
  
  const hmac = crypto.createHmac('sha256', PADDLE_WEBHOOK_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['paddle-signature'] as string;
    const payload = JSON.stringify(req.body);

    // 验证签名（生产环境必须验证）
    // if (!verifyPaddleSignature(payload, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const event = req.body;
    const eventType = event.event_type;
    const data = event.data;

    console.log('Paddle webhook received:', eventType);

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.activated':
      case 'subscription.updated': {
        const email = data.customer?.email;
        const subscriptionId = data.id;
        const status = data.status; // active, canceled, past_due, paused
        const priceId = data.items?.[0]?.price?.id;
        const currentPeriodEnd = data.current_billing_period?.ends_at;

        // 确定计划类型
        let plan = 'pro-monthly';
        if (priceId === 'pri_01khq8064yknf0m9afmw3xfgfv') {
          plan = 'pro-yearly';
        }

        if (email) {
          // 更新或插入订阅记录
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_email: email,
              paddle_subscription_id: subscriptionId,
              status: status === 'active' ? 'pro' : 'free',
              plan: plan,
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_email'
            });

          if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Database error' });
          }

          console.log(`Subscription ${status} for ${email}`);
        }
        break;
      }

      case 'subscription.canceled':
      case 'subscription.paused': {
        const email = data.customer?.email;

        if (email) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('user_email', email);

          if (error) {
            console.error('Supabase error:', error);
          }

          console.log(`Subscription canceled for ${email}`);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', eventType);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
