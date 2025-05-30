# 🚀 Food Ordering App - Vercel 部署指南

## 📋 部署前检查清单

### ✅ 必备条件

- [ ] GitHub 账户
- [ ] Vercel 账户
- [ ] Supabase 项目已完全配置
- [ ] 已执行 `database-migration.md` 中的所有数据库迁移
- [ ] 所有环境变量准备就绪

## 🔧 步骤 1：准备 Git 仓库

### 1.1 初始化 Git（如果还没有）

```bash
git init
git add .
git commit -m "Initial commit: Food Ordering App"
```

### 1.2 推送到 GitHub

```bash
# 创建 GitHub 仓库，然后：
git remote add origin https://github.com/YOUR_USERNAME/food-ordering-app.git
git branch -M main
git push -u origin main
```

## 🌐 步骤 2：Vercel 部署

### 2.1 连接 GitHub

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 从 GitHub 导入你的仓库
4. 选择 "food-ordering-app" 仓库

### 2.2 配置项目设置

- **Framework Preset**: Next.js
- **Root Directory**: `./` (根目录)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (自动检测)
- **Install Command**: `npm install`

### 2.3 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

| 变量名                               | 值                                                                      | 类型       |
| ------------------------------------ | ----------------------------------------------------------------------- | ---------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | `https://qvaydsqqgpufbzjudzod.supabase.co`                              | Plain Text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`                               | Secret     |
| `GOOGLE_CLIENT_ID`                   | `207627015-5bngo99q14gl3m6hbvh8bt55qt1l500f.apps.googleusercontent.com` | Secret     |
| `GOOGLE_CLIENT_SECRET`               | `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`                                   | Secret     |
| `NEXT_PUBLIC_USE_REAL_STRIPE`        | `true`                                                                  | Plain Text |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51P7JPaP8kqU6cZlP...`                                          | Plain Text |
| `STRIPE_SECRET_KEY`                  | `sk_test_51P7JPaP8kqU6cZlP...`                                          | Secret     |

## ⚙️ 步骤 3：配置 Supabase 设置

### 3.1 更新 Supabase 认证设置

在 Supabase Dashboard → Authentication → URL Configuration：

```
Site URL: https://your-app-name.vercel.app
Redirect URLs:
- https://your-app-name.vercel.app/auth/callback
- https://your-app-name.vercel.app
```

### 3.2 更新 Google OAuth 设置

在 Google Cloud Console → OAuth 2.0 客户端 IDs：

**授权的重定向 URI:**

```
https://qvaydsqqgpufbzjudzod.supabase.co/auth/v1/callback
```

**授权的 JavaScript 来源:**

```
https://your-app-name.vercel.app
```

### 3.3 更新 Stripe Webhook 端点

在 Stripe Dashboard → Webhooks：

**端点 URL:**

```
https://your-app-name.vercel.app/api/webhooks/stripe
```

**监听事件:**

- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## 🔄 步骤 4：部署和测试

### 4.1 部署

点击 "Deploy" 按钮，Vercel 会自动：

1. 安装依赖
2. 构建应用
3. 部署到 CDN

### 4.2 测试功能

部署完成后测试以下功能：

- [ ] 用户注册/登录
- [ ] Google OAuth 登录
- [ ] 菜单浏览
- [ ] 购物车功能
- [ ] 支付流程 (Stripe)
- [ ] 管理员功能
- [ ] 用户管理
- [ ] 背景图片上传

## 🏠 步骤 5：自定义域名（可选）

### 5.1 添加域名

在 Vercel 项目设置 → Domains：

1. 添加你的域名
2. 配置 DNS 记录
3. 等待 SSL 证书生成

### 5.2 更新所有配置

记得在所有服务中更新域名：

- Supabase 认证设置
- Google OAuth 设置
- Stripe Webhook 设置

## 🛡️ 步骤 6：安全检查

### 6.1 环境变量检查

确保所有敏感信息都标记为 "Secret"：

- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6.2 CORS 设置

确保 Supabase 允许你的域名访问。

### 6.3 RLS 策略

确认所有 Row Level Security 策略正常工作。

## 🔍 故障排除

### 常见问题

#### 1. 构建失败

**解决方案:**

- 检查 TypeScript 错误
- 确保所有依赖都在 `package.json` 中
- 检查环境变量是否正确设置

#### 2. 认证不工作

**解决方案:**

- 检查 Supabase URL 配置
- 确认 Google OAuth 重定向 URI
- 验证环境变量

#### 3. 支付失败

**解决方案:**

- 检查 Stripe webhook 端点
- 验证 Stripe 密钥
- 确认 webhook 签名

#### 4. 图片上传失败

**解决方案:**

- 检查 Supabase Storage 策略
- 确认 RLS 权限
- 验证文件大小限制

## 📊 监控和维护

### 性能监控

- 使用 Vercel Analytics
- 监控 Core Web Vitals
- 检查函数执行时间

### 日志查看

- Vercel 函数日志
- Supabase 日志
- Stripe 事件日志

## 🎉 部署完成

恭喜！您的 Food Ordering 应用现已成功部署到 Vercel！

访问链接：`https://your-app-name.vercel.app`

### 下一步

1. 设置监控和报警
2. 配置自动部署
3. 添加更多功能
4. 优化性能
5. 设置备份策略
