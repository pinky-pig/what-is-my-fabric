#!/usr/bin/env sh

# 发生错误时终止
set -e

# 打包项目
npm run build

# 进入生成的文件夹目录
cd dist

# 执行命令上传到GitHub仓库到 gh-pages 分支（代码在master分支，打包生成的静态页面在gh-pages分支）
git init
# git checkout -b main
git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages


# git push -f https://github.com/pinky-pig/what-is-my-blog.git master:gh-pages

# 返回目录，将刚才打包生成的静态文件在目录中删除
cd -
rm -rf docs/.vitepress/dist
