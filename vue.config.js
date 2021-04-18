// vue.config.js for less-loader@6.0.0
module.exports = {
    css: {
      loaderOptions: {
        less: {
          lessOptions: {
            // If you are using less-loader@5 please spread the lessOptions to options directly
            modifyVars: {
              'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '4px',// 组件/浮层圆角
                  'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
                  'border-color-base': '#d9d9d9', // 边框色
                  'text-color': 'rgba(0, 0, 0, 0.65)',
                  'text-color-secondary': 'rgba(0, 0, 0, 0.45)',
                  'font-size-base': '14px',
                  'success-color': '#52c41a',
                  
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  };