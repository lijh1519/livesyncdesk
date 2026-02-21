import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// DodoPayments Product IDs
const PRODUCT_YEARLY = 'pdt_0NYxaqul2qgCyM8Ne7MZr';

// 记录 webhook 日志
async function logWebhook(eventType: string, payload: any) {
  try {
    await supabase.from('webhook_logs').insert({
      event_type: eventType,
      payload: payload
    });
  } catch (e) {
    console.error('Failed to log webhook:', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    const eventType = event.type;
    const data = event.data;

    // 记录所有 webhook 到数据库
    await logWebhook(eventType, event);

    console.log('DodoPayments webhook received:', eventType);

    switch (eventType) {
      case 'subscription.active':
      case 'subscription.renewed': {
        // 订阅激活或续费
        const email = data.customer?.email || data.metadata?.user_email;
        const subscriptionId = data.subscription_id;
        const productId = data.product_id;
        const expiresAt = data.expires_at || data.next_billing_date;

        // 判断计划类型
        const plan = productId === PRODUCT_YEARLY ? 'pro-yearly' : 'pro-monthly';

        if (email) {
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_email: email,
              subscription_id: subscriptionId,
              product_id: productId,
              status: 'pro',
              plan: plan,
              current_period_end: expiresAt,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_email,product_id'
            });

          if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Database error' });
          }

          console.log(`Subscription activated for ${email}, plan: ${plan}, expires: ${expiresAt}`);
        }
        break;
      }

      case 'subscription.on_hold':
      case 'subscription.failed': {
        // 订阅暂停或失败
        const email = data.customer?.email || data.metadata?.user_email;

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

          console.log(`Subscription cancelled/failed for ${email}`);
        }
        break;
      }

      case 'payment.succeeded': {
        // 支付成功（可用于记录交易）
        console.log('Payment succeeded:', data.payment_id);
        break;
      }

      case 'payment.failed': {
        // 支付失败
        console.log('Payment failed:', data.payment_id);
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
