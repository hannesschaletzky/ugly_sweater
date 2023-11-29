## kill process on port 3000

```
fuser -k 3000/tcp
```

## manage app with pm2

```
cd /code/ugly_sweater
git pull origin main
pm2 start "npm run dev"
pm2 list
pm2 logs
pm2 delete 0
```
