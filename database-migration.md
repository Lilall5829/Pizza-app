# 数据库迁移 - 添加配送信息字段和用户管理字段

请在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL 命令来添加配送信息相关字段和用户管理所需字段：

## 步骤 0: 添加缺失的基础字段（重要！）

```sql
-- 为 profiles 表添加缺失的时间戳字段
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL,
ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now();

-- 为现有记录设置 created_at 值（如果为空）
UPDATE "public"."profiles"
SET "created_at" = now()
WHERE "created_at" IS NULL;

-- 为现有记录设置 updated_at 值（如果为空）
UPDATE "public"."profiles"
SET "updated_at" = now()
WHERE "updated_at" IS NULL;
```

## 步骤 1: 为 profiles 表添加默认地址字段

```sql
-- 为 profiles 表添加默认地址和联系方式字段
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "default_address" TEXT,
ADD COLUMN IF NOT EXISTS "default_city" TEXT,
ADD COLUMN IF NOT EXISTS "default_postal_code" TEXT,
ADD COLUMN IF NOT EXISTS "default_province" TEXT,
ADD COLUMN IF NOT EXISTS "default_country" TEXT DEFAULT 'Canada';
```

## 步骤 2: 为 orders 表添加配送信息字段

```sql
-- 为 orders 表添加配送信息字段
ALTER TABLE "public"."orders"
ADD COLUMN IF NOT EXISTS "delivery_address" TEXT,
ADD COLUMN IF NOT EXISTS "delivery_city" TEXT,
ADD COLUMN IF NOT EXISTS "delivery_postal_code" TEXT,
ADD COLUMN IF NOT EXISTS "delivery_province" TEXT,
ADD COLUMN IF NOT EXISTS "delivery_country" TEXT DEFAULT 'Canada',
ADD COLUMN IF NOT EXISTS "delivery_phone" TEXT,
ADD COLUMN IF NOT EXISTS "delivery_instructions" TEXT,
ADD COLUMN IF NOT EXISTS "customer_name" TEXT;
```

## 步骤 3: 创建触发器自动更新 updated_at 字段

```sql
-- 创建函数来自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 profiles 表创建触发器
DROP TRIGGER IF EXISTS profiles_handle_updated_at ON "public"."profiles";
CREATE TRIGGER profiles_handle_updated_at
    BEFORE UPDATE ON "public"."profiles"
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
```

## 步骤 4: 添加数据验证约束（可选）

```sql
-- 添加地址验证约束
ALTER TABLE "public"."profiles"
ADD CONSTRAINT IF NOT EXISTS "phone_format" CHECK (phone IS NULL OR phone ~ '^[\+]?[1-9][\d]{0,15}$'),
ADD CONSTRAINT IF NOT EXISTS "postal_code_format" CHECK (default_postal_code IS NULL OR default_postal_code ~ '^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$');

ALTER TABLE "public"."orders"
ADD CONSTRAINT IF NOT EXISTS "delivery_phone_format" CHECK (delivery_phone IS NULL OR delivery_phone ~ '^[\+]?[1-9][\d]{0,15}$'),
ADD CONSTRAINT IF NOT EXISTS "delivery_postal_code_format" CHECK (delivery_postal_code IS NULL OR delivery_postal_code ~ '^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$');
```

## 步骤 5: 创建索引（可选，提高查询性能）

```sql
-- 创建地址相关的索引以提高查询性能
CREATE INDEX IF NOT EXISTS "idx_profiles_default_city" ON "public"."profiles" ("default_city");
CREATE INDEX IF NOT EXISTS "idx_profiles_created_at" ON "public"."profiles" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_profiles_group" ON "public"."profiles" ("group");
CREATE INDEX IF NOT EXISTS "idx_orders_delivery_city" ON "public"."orders" ("delivery_city");
CREATE INDEX IF NOT EXISTS "idx_orders_delivery_postal_code" ON "public"."orders" ("delivery_postal_code");
```

## 步骤 6: 添加字段注释（可选）

```sql
-- 添加注释说明字段用途
COMMENT ON COLUMN "public"."profiles"."created_at" IS 'Account creation timestamp';
COMMENT ON COLUMN "public"."profiles"."updated_at" IS 'Last profile update timestamp';
COMMENT ON COLUMN "public"."profiles"."phone" IS 'User primary phone number';
COMMENT ON COLUMN "public"."profiles"."default_address" IS 'User default delivery address';
COMMENT ON COLUMN "public"."profiles"."default_city" IS 'User default delivery city';
COMMENT ON COLUMN "public"."profiles"."default_postal_code" IS 'User default postal code (Canadian format)';
COMMENT ON COLUMN "public"."profiles"."default_province" IS 'User default province/state';

COMMENT ON COLUMN "public"."orders"."delivery_address" IS 'Specific delivery address for this order';
COMMENT ON COLUMN "public"."orders"."delivery_city" IS 'Delivery city for this order';
COMMENT ON COLUMN "public"."orders"."delivery_postal_code" IS 'Delivery postal code for this order';
COMMENT ON COLUMN "public"."orders"."delivery_phone" IS 'Contact phone for delivery';
COMMENT ON COLUMN "public"."orders"."delivery_instructions" IS 'Special delivery instructions';
COMMENT ON COLUMN "public"."orders"."customer_name" IS 'Customer name for delivery';
```

## 步骤 7: 修复用户管理的 RLS 策略

```sql
-- 删除现有的策略（使用正确的策略名称）
DROP POLICY IF EXISTS "Users can update own profile." ON "public"."profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON "public"."profiles";
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON "public"."profiles";
DROP POLICY IF EXISTS "Admins can update any profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Admins can delete other users" ON "public"."profiles";

-- 创建新的策略
-- 1. 所有人都可以查看用户资料
CREATE POLICY "profiles_select_policy" ON "public"."profiles"
    FOR SELECT USING (true);

-- 2. 用户可以更新自己的资料
CREATE POLICY "profiles_update_own" ON "public"."profiles"
    FOR UPDATE USING (auth.uid() = id);

-- 3. 管理员可以更新任何用户的资料（包括角色）
CREATE POLICY "profiles_update_admin" ON "public"."profiles"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "public"."profiles"
            WHERE id = auth.uid() AND "group" = 'ADMIN'
        )
    );

-- 4. 管理员可以删除任何用户（除了自己）
CREATE POLICY "profiles_delete_admin" ON "public"."profiles"
    FOR DELETE USING (
        auth.uid() != id AND
        EXISTS (
            SELECT 1 FROM "public"."profiles"
            WHERE id = auth.uid() AND "group" = 'ADMIN'
        )
    );
```

## 步骤 8: 验证管理员用户存在

```sql
-- 检查是否有管理员用户
SELECT id, full_name, username, "group", created_at
FROM "public"."profiles"
WHERE "group" = 'ADMIN';

-- 如果没有管理员用户，将当前用户设置为管理员（替换为您的用户ID）
-- UPDATE "public"."profiles"
-- SET "group" = 'ADMIN'
-- WHERE id = 'YOUR_USER_ID_HERE';
```

## 步骤 9: 测试 RLS 策略

```sql
-- 作为管理员测试更新其他用户角色
-- 这个查询应该成功（如果您是管理员）
-- SELECT auth.uid(); -- 查看当前用户ID

-- 测试更新操作（替换为实际的用户ID）
-- UPDATE "public"."profiles"
-- SET "group" = 'CUSTOMER', updated_at = now()
-- WHERE id = 'SOME_OTHER_USER_ID'
-- RETURNING *;
```

## 执行顺序

**重要：必须按以下顺序执行：**

1. **首先执行步骤 0**（添加缺失的时间戳字段）
2. 然后执行步骤 1 和 2（添加其他字段）
3. 执行步骤 3（创建触发器）
4. 测试应用功能
5. 如需要，再执行步骤 4、5、6（添加约束、索引和注释）

## 验证迁移

执行完迁移后，可以运行以下查询来验证字段是否成功添加：

```sql
-- 检查 profiles 表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查 orders 表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 验证触发器是否创建成功
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'profiles';
```

## 故障排除

如果在用户管理页面仍然遇到字段不存在的错误：

1. 确认所有 SQL 命令都成功执行
2. 检查 Supabase 仪表板中的表结构
3. 重新启动 Next.js 开发服务器
4. 清除浏览器缓存和应用程序缓存

## 测试用户管理功能

迁移完成后，您应该能够：

1. 访问 `/admin/users` 页面
2. 查看用户列表和统计信息
3. 搜索和过滤用户
4. 编辑用户角色
5. 查看用户详细信息
