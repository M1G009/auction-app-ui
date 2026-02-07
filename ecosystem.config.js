module.exports = {
  apps: [
    {
      name: "auction-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 7001",
      cwd: "/var/www/auction-app/client",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 7001
      },
      error_file: "/var/log/pm2/auction-app-error.log",
      out_file: "/var/log/pm2/auction-app-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};
