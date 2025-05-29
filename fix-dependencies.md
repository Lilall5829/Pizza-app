# 🔧 修复依赖问题指南

## 错误分析

Metro 打包错误："Unable to resolve ../../Utilities/Platform" 通常是由以下原因引起：

1. React Native 版本与 Expo 版本不匹配
2. node_modules 依赖损坏
3. 缓存冲突

## 解决步骤

### 步骤 1：完全清理项目

```bash
# 1. 关闭所有终端和编辑器
# 2. 手动删除以下文件夹：
#    - node_modules
#    - .expo (如果存在)
#    - .next (如果存在)

# 3. 清理npm缓存
npm cache clean --force
```

### 步骤 2：更新 package.json 中的版本

将以下版本更新到 package.json：

```json
{
  "dependencies": {
    "expo": "~50.0.20",
    "react-native": "0.73.6",
    "expo-file-system": "~16.0.9",
    "expo-router": "~3.4.10",
    "expo-splash-screen": "~0.26.5",
    "expo-system-ui": "~2.9.4"
  }
}
```

### 步骤 3：重新安装依赖

```bash
npm install
```

### 步骤 4：清除 Expo 缓存启动

```bash
npx expo start --clear
```

## 快速修复命令序列

按顺序执行：

```bash
# 清理
npm cache clean --force

# 重装依赖
npm install

# 更新Expo CLI
npm install -g @expo/cli@latest

# 清缓存启动
npx expo start --clear
```

## 如果问题持续存在

### 方案 A：强制重置 React Native

```bash
npx react-native clean
npm install
npx expo start --clear
```

### 方案 B：使用 Yarn 替代 npm

```bash
# 安装yarn
npm install -g yarn

# 删除package-lock.json
# 重新安装
yarn install
yarn start
```

### 方案 C：降级到稳定版本

在 package.json 中使用这些经过测试的稳定版本：

```json
{
  "dependencies": {
    "expo": "~49.0.15",
    "react-native": "0.72.6"
  }
}
```

## 验证修复

启动成功的标志：

- ✅ Metro bundler 启动成功
- ✅ 没有模块解析错误
- ✅ 显示 QR 码或开发服务器地址
- ✅ 可以在浏览器访问 http://localhost:8081
