import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import { getToken } from './utils/auth'
import { parseOAuthCallback, handleOAuthCallback, getAndClearRedirectUri } from './utils/oauth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
      meta: { requiresAuth: true },
    },
    {
      path: '/oauth/callback',
      name: 'oauthCallback',
      beforeEnter: async (to, from, next) => {
        // 处理OAuth回调（从URL查询参数解析，不依赖路由query）
        const callbackParams = parseOAuthCallback()
        
        if (callbackParams) {
          if (callbackParams.error) {
            // OAuth授权失败
            console.error('[Router] OAuth授权失败:', callbackParams.error, callbackParams.errorDescription)
            next({ path: '/', query: { error: callbackParams.error } })
            return
          }
          
          if (callbackParams.code && callbackParams.state) {
            // 处理OAuth回调
            const success = await handleOAuthCallback(callbackParams.code, callbackParams.state)
            
            if (success) {
              // 授权成功，重定向到之前保存的路径
              const redirectUri = getAndClearRedirectUri()
              const targetPath = redirectUri || '/'
              
              // 在hash模式下，需要手动清理URL中的查询参数
              const baseUrl = window.location.origin
              const hashPath = targetPath.startsWith('/') ? targetPath : '/' + targetPath
              const cleanUrl = baseUrl + '#' + hashPath
              window.location.replace(cleanUrl)
            } else {
              next({ path: '/', query: { error: 'authorization_failed' } })
            }
            return
          }
        }
        
        next('/')
      },
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('./views/404.vue'),
    },
  ],
})

// 路由守卫：检查是否需要认证
router.beforeEach((to, from, next) => {
  // 首先检查URL中是否有OAuth回调参数（必须在最前面检查，避免路由匹配到其他路由）
  const urlParams = new URLSearchParams(window.location.search)
  const hasOAuthCode = urlParams.get('code')
  const hasOAuthState = urlParams.get('state')
  const hasOAuthError = urlParams.get('error')
  
  // 如果URL中有OAuth回调参数，必须确保路由匹配到/oauth/callback
  // 这个检查必须在最前面，避免路由匹配到其他路由（如/）导致组件提前加载
  if ((hasOAuthCode && hasOAuthState) || hasOAuthError) {
    // 如果路由已经匹配到/oauth/callback，让beforeEnter处理，不要再次跳转
    if (to.path === '/oauth/callback') {
      next()
      return
    }
    const query = {}
    if (hasOAuthCode) query.code = hasOAuthCode
    if (hasOAuthState) query.state = hasOAuthState
    if (hasOAuthError) query.error = hasOAuthError
    if (urlParams.get('error_description')) query.error_description = urlParams.get('error_description')
    
    // 强制跳转，阻止当前路由继续，使用replace避免在历史记录中留下记录
    // 跳转后路由会重新匹配到/oauth/callback，触发beforeEnter处理OAuth回调
    next({ path: '/oauth/callback', query, replace: true })
    return
  }
  
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = getToken()
    console.log('[Router] Token检查结果:', { hasToken: !!token, tokenLength: token ? token.length : 0 })
    
    if (!token) {
      import('./utils/oauth').then(oauthModule => {
        console.log('[Router] 调用redirectToAuthorization')
        oauthModule.redirectToAuthorization(to.fullPath)
      })
      return
    } else {
      console.log('[Router] Token有效，允许访问')
    }
  } else {
    console.log('[Router] 路由不需要认证，直接通过')
  }
  
  next()
})

export default router
