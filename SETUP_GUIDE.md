# 🔧 FoodOrdering 项目配置指南

## 1. 环境变量配置

在项目根目录创建 `.env` 文件，包含以下内容：

```env
# Supabase 配置
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON=your_supabase_anon_key

# Stripe 配置
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 2. Supabase 设置步骤

### 2.1 创建 Supabase 项目

1. 访问 [Supabase.com](https://supabase.com)
2. 创建新账户并登录
3. 点击 "New Project"
4. 选择组织并填写项目信息
5. 等待项目创建完成

### 2.2 获取项目配置

1. 在项目仪表板中，点击左侧的 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: 用作 `EXPO_PUBLIC_SUPABASE_URL`
   - **Project API Keys** 中的 **anon public**: 用作 `EXPO_PUBLIC_SUPABASE_ANON`

### 2.3 设置数据库

1. 在项目中运行数据库迁移：
   ```bash
   npx supabase db push
   ```
2. 或者手动在 Supabase SQL 编辑器中创建表结构

## 3. Stripe 设置步骤

### 3.1 创建 Stripe 账户

1. 访问 [Stripe.com](https://stripe.com)
2. 创建新账户
3. 完成账户验证

### 3.2 获取 API 密钥

1. 在 Stripe 仪表板中，点击 "Developers" → "API keys"
2. 复制以下密钥：
   - **Publishable key**: 用作 `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key**: 用作 `STRIPE_SECRET_KEY`

⚠️ **注意**: 在开发阶段使用测试密钥（以 `pk_test_` 和 `sk_test_` 开头）

## 4. 可选：快速测试配置

如果你想快速体验应用功能，可以使用以下测试配置：

```env
# 仅用于界面测试的虚拟配置
EXPO_PUBLIC_SUPABASE_URL=https://demo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON=demo_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo
```

**注意**: 使用虚拟配置时，数据功能（登录、下单等）不会工作，但可以预览界面。

## 5. 验证配置

配置完成后，运行以下命令验证：

```bash
# 启动开发服务器
npm start

# 检查环境变量是否正确加载
npm run check-env  # 如果有此脚本
```

## 6. 数据库表结构

项目需要以下主要表：

- `products` - 产品信息
- `orders` - 订单信息
- `order_items` - 订单项目
- `profiles` - 用户档案

具体的表结构可以在 `supabase/migrations/` 目录中找到。

## 7. 常见问题

### Q: 无法连接到 Supabase

- 检查 URL 格式是否正确
- 确认 API 密钥是否有效
- 检查网络连接

### Q: Stripe 支付失败

- 确认使用的是正确的测试密钥
- 检查 Stripe webhook 配置

### Q: 应用启动报错

- 运行 `npm install` 确保依赖已安装
- 检查 `.env` 文件格式
- 清除缓存：`expo r -c`
