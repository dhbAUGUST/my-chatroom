#!/bin/bash

# 启动项目
if [ "$1" = "start" ]; then
    kill-port 3000 2>/dev/null
    concurrently "vite" "node server.js"
# 停止项目
elif [ "$1" = "stop" ]; then
    kill-port 3000
    echo "后端服务已停止"
else
    echo "用法: ./run.sh start | stop"
fi
