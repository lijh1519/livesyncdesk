# SaaS 产品开发模板

> 基于 LiveSyncDesk 项目提炼的可复用开发模板，包含登录验证、支付集成、第三方服务配置等核心模块。

---

## 目录

1. [技术栈概览](#1-技术栈概览)
2. [Supabase 登录验证](#2-supabase-登录验证)
3. [Paddle 支付集成](#3-paddle-支付集成)
4. [Vercel 部署配置](#4-vercel-部署配置)
5. [环境变量清单](#5-环境变量清单)
6. [数据库表结构](#6-数据库表结构)
7. [常见问题排查](#7-常见问题排查)

---

## 1. 技术栈概览

| 模块 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript | Vite 构建 |
| 样式 | Tailwind CSS 4 | 原子化 CSS |
| 认证 | Supabase Auth | Google OAuth + Magic Link |
| 支付 | Paddle Billing | 订阅制支付，自动处理税务 |
| 数据库 | Supabase PostgreSQL | 用户数据、订阅状态 |
| 部署 | Vercel | 前端 + Serverless Functions |

---

## 2. Supabase 登录验证

### 2.1 创建 Supabase 项目

1. 访问 https://supabase.com 创建项目
2. 获取以下配置：
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon Key**: 公开 API Key（前端使用）
   - **Service Role Key**: 服务端 Key（Webhook 使用，保密）

### 2.2 配置 Google OAuth

**Supabase 后台配置**：
1. Authentication → Providers → Google
2. 开启 Google provider
3. 填入 Google OAuth Client ID 和 Secret

**Google Cloud Console 配置**：
1. 创建 OAuth 2.0 Client ID
2. 添加授权 JavaScript 来源：
   - `http://localhost:5173`
   - `https://你的域名.com`
3. 添加授权重定向 URI：
   - `https://xxx.supabase.co/auth/v1/callback`

### 2.3 配置 URL 白名单

在 Supabase → Authentication → URL Configuration：
- **Site URL**: `https://你的域名.com`
- **Redirect URLs**:
  - `http://localhost:5173`
  - `http://localhost:5173/**`
  - `https://你的域名.com`
  - `https://你的域名.com/**`

### 2.4 代码实现

**lib/supabase.ts** - Supabase 客户端初始化：
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**contexts/AuthContext.tsx** - 认证上下文：
```typescript
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取初始 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听 auth 状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Google 登录
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) throw error;
  };

  // Email Magic Link 登录
  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**使用方式**：
```typescript
// App.tsx 入口
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// 组件中使用
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <button onClick={signInWithGoogle}>登录</button>;
  
  return <div>欢迎 {user.email}</div>;
}
```

---

## 3. Paddle 支付集成

### 3.1 Paddle 账户设置

**注册流程**：
1. 访问 https://paddle.com 注册（选择 Paddle Billing）
2. 业务类型选择 **Individual/Sole Proprietor**（个人开发者）
3. 完成 KYC 验证（个人信息、业务描述）

**网站验证**：
需要准备以下页面 URL：
- 定价页面：`/pricing`
- 服务条款：`/terms`
- 隐私政策：`/privacy`
- 退款政策：`/refund`

### 3.2 创建产品和价格

**Paddle 后台**：Catalog → Products → + New product

```
Product:
  Name: 你的产品名
  Description: 产品描述
  Tax Category: Software as a Service (SaaS)

Prices:
  1. Monthly: $X.XX USD, Recurring Monthly
  2. Yearly: $XX.XX USD, Recurring Yearly
```

记录 **Price ID**（格式：`pri_01xxx`）

### 3.3 获取 API 凭证

**Sandbox 环境**（测试）：
- Developer Tools → Authentication → Client-side token
- 格式：`test_xxx`

**Production 环境**（正式）：
- 需要完成账户激活后获取
- 格式：`live_xxx`

### 3.4 前端集成

**index.html** - 加载 Paddle.js：
```html
<head>
  <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
</head>
```

**TypeScript 类型声明**：
```typescript
declare global {
  interface Window {
    Paddle: {
      Environment: {
        set: (env: 'sandbox' | 'production') => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, string>;
          customer?: { email?: string };
          settings?: { locale?: string };
        }) => void;
      };
    };
  }
}
```

**初始化和调用**：
```typescript
// Paddle 配置
const PADDLE_CLIENT_TOKEN = 'test_xxx'; // sandbox
const PADDLE_PRICE_MONTHLY = 'pri_01xxx';
const PADDLE_PRICE_YEARLY = 'pri_01yyy';

// 初始化（在 useEffect 中）
useEffect(() => {
  if (window.Paddle) {
    window.Paddle.Environment.set('sandbox'); // 正式环境改为 'production'
    window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
  }
}, []);

// 打开 Checkout
const handleSubscribe = (plan: 'monthly' | 'yearly') => {
  // ⚠️ 重要：必须检查用户已登录
  if (!user?.email) {
    navigate('login');
    return;
  }

  const priceId = plan === 'monthly' ? PADDLE_PRICE_MONTHLY : PADDLE_PRICE_YEARLY;
  
  window.Paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData: { email: user.email }, // ⚠️ 关键：透传邮箱给 webhook
    customer: { email: user.email },
    settings: { locale: 'en' } // 强制英文界面
  });
};
```

### 3.5 Webhook 处理

**api/paddle-webhook.ts** - Vercel Serverless Function：
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// 使用 Service Role Key（有写权限）
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || '';

// 签名验证（生产环境必须开启）
function verifyPaddleSignature(payload: string, signature: string): boolean {
  if (!PADDLE_WEBHOOK_SECRET) return true;
  
  const hmac = crypto.createHmac('sha256', PADDLE_WEBHOOK_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Webhook 日志（调试用）
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
    const eventType = event.event_type;
    const data = event.data;

    // 记录日志
    await logWebhook(eventType, event);

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.activated':
      case 'subscription.updated': {
        // ⚠️ 关键：从 custom_data 获取邮箱（Paddle V2 webhook 不含 customer.email）
        const email = data.custom_data?.email;
        const subscriptionId = data.id;
        const status = data.status;
        const priceId = data.items?.[0]?.price?.id;
        const currentPeriodEnd = data.current_billing_period?.ends_at;

        // 判断计划类型
        let plan = 'pro-monthly';
        if (priceId === PADDLE_PRICE_YEARLY) {
          plan = 'pro-yearly';
        }

        if (email) {
          await supabase
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
        }
        break;
      }

      case 'subscription.canceled':
      case 'subscription.paused': {
        const email = data.custom_data?.email;

        if (email) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'free',
              updated_at: new Date().toISOString()
            })
            .eq('user_email', email);
        }
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
```

### 3.6 配置 Webhook URL

**Paddle 后台**：Developer Tools → Notifications → + New destination

```
URL: https://你的域名.com/api/paddle-webhook
Events: 勾选以下事件
  - subscription.created
  - subscription.activated  
  - subscription.updated
  - subscription.canceled
  - subscription.paused
```

### 3.7 订阅状态查询

**services/subscription.ts**：
```typescript
import { supabase } from '../lib/supabase';

export type SubscriptionStatus = 'free' | 'pro';
export type SubscriptionPlan = 'pro-monthly' | 'pro-yearly' | null;

export interface Subscription {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodEnd: string | null;
}

export async function getUserSubscription(email: string): Promise<Subscription> {
  const defaultSubscription: Subscription = {
    status: 'free',
    plan: null,
    currentPeriodEnd: null
  };

  if (!email) return defaultSubscription;

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status, plan, current_period_end')
      .eq('user_email', email)
      .single();

    if (error || !data) return defaultSubscription;

    return {
      status: data.status === 'pro' ? 'pro' : 'free',
      plan: data.plan as SubscriptionPlan,
      currentPeriodEnd: data.current_period_end
    };
  } catch (error) {
    return defaultSubscription;
  }
}

export async function isPro(email: string): Promise<boolean> {
  const subscription = await getUserSubscription(email);
  return subscription.status === 'pro';
}

// 使用限制配置
export const FREE_LIMITS = {
  aiGenerationsPerDay: 3,
  collaboratorsPerRoom: 2,
  stickyNotesPerRoom: 10
};

export const PRO_LIMITS = {
  aiGenerationsPerDay: Infinity,
  collaboratorsPerRoom: Infinity,
  stickyNotesPerRoom: Infinity
};
```

---

## 4. Vercel 部署配置

### 4.1 项目结构

```
project/
├── api/                    # Vercel Serverless Functions
│   └── paddle-webhook.ts   # Paddle Webhook 处理
├── src/                    # 前端源码
├── vercel.json             # Vercel 配置（可选）
└── package.json
```

### 4.2 环境变量配置

**Vercel Dashboard** → Settings → Environment Variables：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `VITE_SUPABASE_ANON_KEY` | `eyJxxx` | All |
| `SUPABASE_SERVICE_KEY` | `eyJxxx`（Service Role） | Production |
| `PADDLE_WEBHOOK_SECRET` | `pdl_ntfset_xxx` | Production |

### 4.3 API 路由

Vercel 自动将 `/api` 目录下的文件映射为 Serverless Functions：
- `api/paddle-webhook.ts` → `https://你的域名.com/api/paddle-webhook`

---

## 5. 环境变量清单

**.env.example**：
```bash
# Supabase 配置（必填）
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx

# Supabase Service Key（仅服务端使用，不要暴露到前端）
SUPABASE_SERVICE_KEY=eyJxxx

# Paddle 配置
PADDLE_WEBHOOK_SECRET=pdl_ntfset_xxx

# 其他第三方服务（按需添加）
VITE_LIVEBLOCKS_PUBLIC_KEY=pk_dev_xxx
VITE_OPENROUTER_API_KEY=sk-or-v1-xxx
```

---

## 6. 数据库表结构

### 6.1 subscriptions 表

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT UNIQUE NOT NULL,
  paddle_subscription_id TEXT,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'pro')),
  plan TEXT CHECK (plan IN ('pro-monthly', 'pro-yearly')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_subscriptions_email ON subscriptions(user_email);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 6.2 webhook_logs 表（调试用）

```sql
CREATE TABLE webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 定期清理旧日志
-- DELETE FROM webhook_logs WHERE created_at < NOW() - INTERVAL '30 days';
```

### 6.3 RLS 策略

```sql
-- 允许服务端完全访问
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Service Role 绕过 RLS，无需额外策略
-- 如需前端查询，添加：
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.email() = user_email);
```

---

## 7. 常见问题排查

### 7.1 Paddle Checkout 报错 "Something went wrong"

**原因**：域名未添加到 Paddle 白名单

**解决**：
1. Paddle → Checkout → Request website approval
2. 添加你的域名（如 `xxx.vercel.app`）
3. 等待审核通过（通常几分钟）

### 7.2 Paddle Checkout 显示中文

**原因**：Paddle 根据浏览器语言自动本地化

**解决**：添加 `settings: { locale: 'en' }`
```typescript
window.Paddle.Checkout.open({
  items: [...],
  settings: { locale: 'en' }
});
```

### 7.3 Webhook 收到但 subscriptions 表无数据

**原因**：Paddle V2 Billing API 的 webhook 不包含 `customer.email`，只有 `customer_id`

**解决**：前端 Checkout 时通过 `customData` 传入邮箱
```typescript
window.Paddle.Checkout.open({
  items: [...],
  customData: { email: user.email }, // 关键！
  customer: { email: user.email }
});
```

Webhook 中从 `data.custom_data.email` 读取。

### 7.4 报错 "customer ID or email is required"

**原因**：用户未登录就点击订阅按钮

**解决**：在 Checkout 前检查登录状态
```typescript
const handleSubscribe = () => {
  if (!user?.email) {
    navigate('login');
    return;
  }
  // ... 继续 Checkout
};
```

### 7.5 Google 登录后跳转到空白页

**原因**：Supabase URL Configuration 未配置正确的重定向地址

**解决**：
1. Supabase → Authentication → URL Configuration
2. 添加所有可能的回调地址到 Redirect URLs

### 7.6 Vercel Serverless Function 超时

**原因**：默认超时 10 秒，复杂操作可能超时

**解决**：在 `vercel.json` 中配置：
```json
{
  "functions": {
    "api/paddle-webhook.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 附录：快速启动清单

新项目启动时，按以下顺序配置：

### Day 1: 基础设施
- [ ] 创建 Supabase 项目
- [ ] 创建数据库表（subscriptions, webhook_logs）
- [ ] 配置 Google OAuth
- [ ] 部署到 Vercel
- [ ] 配置环境变量

### Day 2: 登录功能
- [ ] 实现 AuthContext
- [ ] 实现 LoginPage（Google + Magic Link）
- [ ] 测试登录流程

### Day 3: 支付功能
- [ ] 注册 Paddle 账户
- [ ] 创建产品和价格
- [ ] 申请域名白名单
- [ ] 集成 Paddle Checkout
- [ ] 配置 Webhook
- [ ] 实现订阅状态查询

### Day 4: 完善
- [ ] 添加法律页面（Terms/Privacy/Refund）
- [ ] 测试完整支付流程
- [ ] 切换到 Production 环境
- [ ] 上线！

---

*文档版本: v1.0 | 更新时间: 2026-02*
