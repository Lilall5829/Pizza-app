# 🚀 FoodOrdering 快速启动指南

## 立即开始（3 分钟体验）

### 1. 创建环境文件

在项目根目录创建 `.env` 文件：

```bash
# 复制粘贴以下内容到 .env 文件

# 测试用的 Supabase 配置（仅界面预览）
EXPO_PUBLIC_SUPABASE_URL=https://demo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON=demo_key

# 测试用的 Stripe 配置（仅界面预览）
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo
```

### 2. 启动应用

```bash
npm start
```

### 3. 在手机上测试

- 下载 **Expo Go** 应用
- 扫描终端显示的二维码
- 应用会在手机上运行

---

## 完整配置（真实数据测试）

如果你想测试完整功能（登录、下单等），需要配置真实的 Supabase 和 Stripe：

### Supabase 配置

1. 访问 [supabase.com](https://supabase.com) 创建项目
2. 获取 Project URL 和 API Key
3. 运行数据库迁移：
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_ID
   npx supabase db push
   ```

### Stripe 配置

1. 访问 [stripe.com](https://stripe.com) 创建账户
2. 获取测试 API 密钥
3. 更新 `.env` 文件中的真实密钥

---

## 项目特性预览

### 🏗️ 架构特点

- **Expo Router**: 基于文件的路由系统
- **组件化设计**: 可复用的 UI 组件
- **状态管理**: React Query + Context
- **类型安全**: 完整的 TypeScript 支持

### 📱 主要功能

- **双端设计**: 用户端 + 管理员端
- **产品管理**: 增删改查产品
- **购物车**: 商品添加、数量管理
- **订单系统**: 下单、状态跟踪
- **用户认证**: 注册、登录
- **在线支付**: Stripe 集成

### 🎯 技术亮点

- **实时更新**: Supabase 实时订阅
- **离线支持**: 本地状态缓存
- **响应式设计**: 适配多种屏幕
- **性能优化**: 图片懒加载、查询缓存

---

## 开发调试

### 常用快捷键

- `r` - 重新加载应用
- `m` - 开发菜单
- `j` - 打开调试器
- `i` - iOS 模拟器（macOS）
- `a` - Android 模拟器
- `w` - Web 浏览器

### 问题排查

```bash
# 清除缓存
expo r -c

# 重装依赖
rm -rf node_modules
npm install

# 检查依赖版本
npm list expo
```
