module.exports = {
  apps: [
    {
      name: 'arch-gen-web',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3050
      },
      error_file: './logs/error.log',
      out_file: './logs/activity.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
