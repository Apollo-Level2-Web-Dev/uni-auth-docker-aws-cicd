Nginx Configuration

```
server {
 listen 80;
 server_name auth.l2dev.xyz;
 client_max_body_size 100m;  # Maximum request size limit

 location / {
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_http_version 1.1;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $host;
  proxy_set_header Access-Controll-Allow-Origin "*";
  proxy_pass http://localhost:5000;
 }
}

```
