-- 验证 Supabase 备份恢复完整性的SQL脚本
-- 在恢复后运行此脚本来检查数据

-- 1. 检查所有必要的表是否存在
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('products', 'profiles', 'orders', 'order_items')
ORDER BY tablename;

-- 2. 检查每个表的记录数量
SELECT 
    'products' as table_name, 
    COUNT(*) as record_count 
FROM products
UNION ALL
SELECT 
    'profiles' as table_name, 
    COUNT(*) as record_count 
FROM profiles
UNION ALL
SELECT 
    'orders' as table_name, 
    COUNT(*) as record_count 
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name, 
    COUNT(*) as record_count 
FROM order_items;

-- 3. 检查产品表的基本数据
SELECT 
    id,
    name,
    price,
    created_at
FROM products
ORDER BY id
LIMIT 10;

-- 4. 检查是否有用户数据
SELECT 
    id,
    full_name,
    "group",
    updated_at
FROM profiles
ORDER BY updated_at DESC
LIMIT 5;

-- 5. 检查最近的订单（如果有）
SELECT 
    o.id,
    o.status,
    o.total,
    o.created_at,
    p.full_name as customer_name
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id
ORDER BY o.created_at DESC
LIMIT 5;

-- 6. 检查 RLS 策略是否正确设置
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. 检查触发器是否存在
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name; 