# gulp 环境搭建

```
# 该命令仅执行一次
npm install --global gulp-cli
npm install
```

# 更新第三方类库

```
# 该命令仅执行一次
npm install -g bower
bower install --save xxx

# 修改 src/lib/lib.less
# 修改 gulpfile.js 中 lib.js 任务

gulp lib.compile
# git 提交修改
```

# 运行demo

```
# 在IDEA中直接访问 src/demo.html， 注意，需要手动确认js，css引入正确。
gulp demo
```


# 本地运行

## 修改本地测试用域名 

```
sudo vi /etc/hosts # 并输入以下内容
127.0.0.1    dev.test.me
```

## 配置 tengine 

修改 ${TENGINE_HOME}/conf/conf.d/kingsilk.net.conf 。
内容如下，并修改相应的端口号为自己的。

```
server {
    listen *:80;
    server_name dev.test.me kingsilk.net www.kingsilk.net;
    root html;
    index  index.html index.htm;

    access_log  logs/kingsilk.net.access.log main;
    error_log   logs/kingsilk.net.error.log;

    location  /qh/mall/local/ { 
        add_header Cache-Control no-cache;
        alias    /home/zll/work/git-repo/kingsilk/qh-wap-front/target/dist/;
    }   

    location /qh/mall/local/16000/ { 
        alias    /home/zll/work/git-repo/kingsilk/qh-wap-front/target/dist/;
    }
    location /qh/mall/local/16000/api/ { 
        proxy_pass              http://localhost:10030;

        proxy_set_header        Host            $host;
        #proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        #proxy_set_header        X-Forwarded-Proto $scheme;
    }   
     location /qh/mall/local/11200/api/ { 
        proxy_pass              http://192.168.0.12:10030;

        proxy_set_header        Host            $host;
        #proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        #proxy_set_header        X-Forwarded-Proto $scheme;
    }


    location  /qh/mall/local/ { 
        add_header Cache-Control no-cache;
        alias    /home/zll/work/git-repo/kingsilk/qh-admin-front/target/dist/;
    }
    location /qh/admin/local/16000/ { 
        alias    /home/zll/work/git-repo/kingsilk/qh-admin-front/target/dist/;
    }
    location /qh/admin/local/16000/api/ { # 后端开发人员本地 API
        proxy_pass              http://localhost:10020;
        proxy_set_header        Host            $host;
        #proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        #proxy_set_header        X-Forwarded-Proto $scheme;
    }
    location /qh/admin/local/11200/ { # 测试环境 api （旧qh-admin）
        proxy_pass              http://192.168.0.12:10020;
        proxy_set_header        Host            $host;
        #proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        #proxy_set_header        X-Forwarded-Proto $scheme;
    }
    location /qh/admin/local/11300/api/ { # 测试环境 api （新qh-admin）
            proxy_pass              http://192.168.0.13:10020;:jjhjkkkk
            proxy_set_header        Host            $host;
            #proxy_set_header        X-Real-IP       $remote_addr;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            #proxy_set_header        X-Forwarded-Proto $scheme;
    }
    location /qh/admin/mock/16025/api/ { # 前端开发人员本地 MOCK API
        proxy_pass              http://localhost:16025;
        proxy_set_header        Host            $host;
        #proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        #proxy_set_header        X-Forwarded-Proto $scheme;
    }   
}
```

## dev 环境配置为使用 mock api

1. 修改  mock/config.js。请本地临时修改，不要提交。


1.  修改 src/gulpfile.js。 这里是修改加载 css，js 的路径

    ```
    const config = {
        dev: {
            base: "./"
        },
        //...
    }
    ```

1.  修改 src/settings-dev.js。这里是修改调用 mock api 的路径

    ```
    var domain = "http://dev.test.me";
    var rootPath = domain + "/qh/admin/mock/";
    var apiPath = rootPath + "/16025";    # 这里的端口号请根据IP地址改为自己的
    ```


## dev 环境配置为使用 测试环境的 api

1.  修改 src/gulpfile.js。 这里是修改加载 css，js 的路径

    ```
    const config = {
        dev: {
            base: "./"
        },
        //...
    }
    ```

1.  修改 src/settings-dev.js。这里是修改调用 mock api 的路径

    ```
    var domain = "http://dev.test.me";
    var rootPath = domain + "/qh/admin/local/";
    var apiPath = rootPath + "/11200/api";
    ```

## 运行dev环境

```
# 确保tengine启动中
sudo service tengine restart

# gulp编译，并监视
gulp

# 浏览器访问 http://dev.test.me/qh/admin/local/16000/
# 如果前端工程有修改，请 F5 或者 Ctrl+F5 刷新浏览器。
```