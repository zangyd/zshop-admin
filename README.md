安装 node

在 node.js 官网下载合适您系统的 node.js（推荐 10 以上的版本），安装完毕后可查看版本号。

node -v
v10.13.0

npm -v
6.12.0
安装 @vue/cli

此依赖建议全局安装。

npm install -g @vue/cli

安装依赖
进入到克隆下来的项目目录中，执行安装依赖命令：
npm install
# 或
yarn

项目启动

# 启动服务
npm run serve

# 正式发布
npm run build

# 检测修复
npm run lint

# 单元测试
npm run test:unit