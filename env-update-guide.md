# 🔄 更新 .env 文件指南

## 当前的问题

旧的 Supabase 项目已暂停，需要使用新项目的配置。

## 更新步骤

### 1. 创建新 Supabase 项目后，获取以下信息：

- Project URL: `https://新项目ID.supabase.co`
- anon public key: `eyJ...新的密钥`

### 2. 更新你的 .env 文件：

将当前的：

```env
EXPO_PUBLIC_SUPABASE_URL=http://192.168.1.111:54321
EXPO_PUBLIC_SUPABASE_ANON=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

更新为：

```env
# 新的 Supabase 线上配置
EXPO_PUBLIC_SUPABASE_URL=https://你的新项目ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON=你的新anon_public密钥

# Stripe 配置保持不变
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51P7JPaP8kqU6cZlPtVSZYqBltWgb07wvR04cwN9pcLo3Co3Sxr5jzJv25fzfGUJKtVj9QN02RW44EUHiqU0QeToY004hJbPkvw
STRIPE_SECRET_KEY=sk_test_51P7JPaP8kqU6cZlPpJA8xie9QGmP8EipfCC4eZh4KoBoyTxE7LYPMiEeVFR3vyQ41VRPAVV0yXmlx9XiqCYeuRs3008RKr9UUE
```

### 3. 重启应用测试

```bash
npm start
```

## ✅ 完成标志

- 新项目创建成功
- 数据库脚本执行完成
- .env 文件更新完成
- 应用能正常连接到新数据库
- 可以看到示例产品数据
