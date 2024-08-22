  pm2 stop my-next-app
  pm2 delete my-next-app
 
  npm run build
  pm2 start npm --name "my-next-app" -- start
   
