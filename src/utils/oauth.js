/**
 * OAuth2.0 客户端工具函数
 */

// OAuth配置（从环境变量读取）
const OAUTH_CONFIG = {
  authorizationServer: process.env.VUE_APP_OAUTH_SERVER_URL || 'http://127.0.0.1:8090',
  clientId: process.env.VUE_APP_OAUTH_CLIENT_ID || '',
  redirectUri: process.env.VUE_APP_OAUTH_REDIRECT_URI || window.location.origin + '/oauth/callback',
  scope: process.env.VUE_APP_OAUTH_SCOPE || 'read write',
}

// 存储state的key
const OAUTH_STATE_KEY = 'oauth_state'
const OAUTH_REDIRECT_KEY = 'oauth_redirect_uri'

/**
 * 生成随机state参数（用于CSRF防护）
 */
export function generateState() {
  const array = new Uint32Array(1)
  window.crypto.getRandomValues(array)
  return array[0].toString(36) + Date.now().toString(36)
}

/**
 * 保存state到localStorage
 */
export function saveState(state) {
  try {
    localStorage.setItem(OAUTH_STATE_KEY, state)
    console.log('[OAuth] State已保存到localStorage:', state)
    
    // 验证保存是否成功
    const saved = localStorage.getItem(OAUTH_STATE_KEY)
    if (saved !== state) {
      console.error('[OAuth] State保存验证失败！', { expected: state, saved })
    } else {
      console.log('[OAuth] State保存验证成功')
    }
  } catch (e) {
    console.error('[OAuth] 保存state到localStorage失败:', e)
    throw e
  }
}

/**
 * 获取state（不删除，用于验证）
 */
export function getState() {
  const state = localStorage.getItem(OAUTH_STATE_KEY)
  console.log('[OAuth] 从localStorage获取state（不删除）:', state)
  return state
}

/**
 * 清除state
 */
export function clearState() {
  const state = localStorage.getItem(OAUTH_STATE_KEY)
  if (state) {
    localStorage.removeItem(OAUTH_STATE_KEY)
    console.log('[OAuth] State已从localStorage清除:', state)
  } else {
    console.warn('[OAuth] State不存在于localStorage，无法清除')
  }
}

/**
 * 保存重定向前的URL
 */
export function saveRedirectUri(uri) {
  localStorage.setItem(OAUTH_REDIRECT_KEY, uri)
  console.log('[OAuth] 重定向URI已保存到localStorage:', uri)
}

/**
 * 获取并清除重定向前的URL
 */
export function getAndClearRedirectUri() {
  const uri = localStorage.getItem(OAUTH_REDIRECT_KEY)
  console.log('[OAuth] 从localStorage获取重定向URI:', uri)
  if (uri) {
    localStorage.removeItem(OAUTH_REDIRECT_KEY)
    console.log('[OAuth] 重定向URI已从localStorage清除')
  }
  return uri || '/'
}

/**
 * 构建授权URL
 * @param {string} state - 状态参数
 * @returns {string} 授权URL
 */
export function buildAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.scope,
    state: state,
  })
  return `${OAUTH_CONFIG.authorizationServer}/api/oauth/authorize?${params.toString()}`
}

/**
 * 重定向到授权服务器
 * @param {string} currentPath - 当前路径（用于授权后重定向回来）
 */
export function redirectToAuthorization(currentPath = window.location.pathname) {
  console.log('[OAuth] redirectToAuthorization 开始，当前路径:', currentPath)
  console.log('[OAuth] 当前localStorage状态:', {
    hasState: !!localStorage.getItem(OAUTH_STATE_KEY),
    hasRedirectUri: !!localStorage.getItem(OAUTH_REDIRECT_KEY),
    allKeys: Object.keys(localStorage).filter(k => k.includes('oauth') || k.includes('state')),
  })
  
  // 保存当前路径
  saveRedirectUri(currentPath)
  console.log('[OAuth] 已保存重定向URI:', currentPath)
  
  // 生成state
  const state = generateState()
  console.log('[OAuth] 生成state:', state)
  saveState(state)
  console.log('[OAuth] 已生成并保存state:', state)
  
  // 再次验证state是否保存成功
  const verifyState = localStorage.getItem(OAUTH_STATE_KEY)
  console.log('[OAuth] State保存后验证:', { 
    expected: state, 
    saved: verifyState, 
    match: verifyState === state,
    localStorageKeys: Object.keys(localStorage),
  })
  
  if (verifyState !== state) {
    console.error('[OAuth] State保存验证失败！无法继续重定向')
    return
  }
  
  // 构建授权URL并重定向
  const authUrl = buildAuthorizationUrl(state)
  console.log('[OAuth] 构建授权URL:', authUrl)
  console.log('[OAuth] 准备重定向到授权服务器')
  console.log('[OAuth] 重定向前最终localStorage状态:', {
    state: localStorage.getItem(OAUTH_STATE_KEY),
    redirectUri: localStorage.getItem(OAUTH_REDIRECT_KEY),
  })
  window.location.href = authUrl
}

/**
 * 处理OAuth回调
 * @param {string} code - 授权码
 * @param {string} state - 状态参数
 * @returns {Promise<boolean>} 是否成功
 */
export async function handleOAuthCallback(code, state) {
  console.log('[OAuth] handleOAuthCallback 开始，code长度:', code ? code.length : 0, 'state:', state)
  
  // 获取保存的state（不删除），用于验证
  const savedState = getState()
  console.log('[OAuth] State验证前检查:', { 
    savedState: savedState, 
    receivedState: state, 
    match: savedState === state,
    localStorageKeys: Object.keys(localStorage).filter(k => k.includes('oauth') || k.includes('state')),
  })
  
  // 验证state（不删除）
  if (!savedState || savedState !== state) {
    console.error('[OAuth] State验证失败:', { 
      savedState, 
      receivedState: state,
      allLocalStorageKeys: Object.keys(localStorage),
    })
    return false
  }
  
  console.log('[OAuth] State验证通过:', { savedState, receivedState: state })

  try {
    console.log('[OAuth] 开始用授权码换取token')
    // 用授权码换取token
    const tokenResponse = await exchangeCodeForToken(code)
    console.log('[OAuth] Token响应:', {
      hasAccessToken: !!(tokenResponse && tokenResponse.access_token),
      hasRefreshToken: !!(tokenResponse && tokenResponse.refresh_token),
      tokenType: tokenResponse && tokenResponse.token_type,
    })
    
    if (tokenResponse && tokenResponse.access_token) {
      console.log('[OAuth] 开始保存token')
      // 保存token
      const authModule = await import('./auth')
      authModule.setToken(tokenResponse.access_token)
      console.log('[OAuth] Access token已保存，长度:', tokenResponse.access_token.length)
      
      if (tokenResponse.refresh_token) {
        authModule.setRefreshToken(tokenResponse.refresh_token)
        console.log('[OAuth] Refresh token已保存，长度:', tokenResponse.refresh_token.length)
      }
      
      // 验证token是否已保存
      const savedToken = authModule.getToken()
      console.log('[OAuth] Token保存验证:', { saved: !!savedToken, length: savedToken ? savedToken.length : 0 })
      
      // Token获取成功后，清除state
      clearState()
      console.log('[OAuth] Token获取成功，已清除state')
      
      return true
    }
    console.error('[OAuth] Token响应中没有access_token')
    return false
  } catch (error) {
    console.error('[OAuth] OAuth回调处理失败:', error)
    return false
  }
}

/**
 * 用授权码换取token
 * @param {string} code - 授权码
 * @returns {Promise<Object>} token响应
 */
async function exchangeCodeForToken(code) {
  console.log('[OAuth] exchangeCodeForToken 开始')
  console.log('[OAuth] 配置:', {
    authorizationServer: OAUTH_CONFIG.authorizationServer,
    clientId: OAUTH_CONFIG.clientId,
    redirectUri: OAUTH_CONFIG.redirectUri,
    hasClientSecret: !!process.env.VUE_APP_OAUTH_CLIENT_SECRET,
  })
  
  const formData = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    client_id: OAUTH_CONFIG.clientId,
    client_secret: process.env.VUE_APP_OAUTH_CLIENT_SECRET || '', // 注意：在生产环境中，客户端密钥不应该暴露在前端
  })

  const tokenUrl = `${OAUTH_CONFIG.authorizationServer}/api/oauth/token`
  console.log('[OAuth] 请求URL:', tokenUrl)
  console.log('[OAuth] 请求参数:', {
    grant_type: 'authorization_code',
    code: code.substring(0, 20) + '...',
    redirect_uri: OAUTH_CONFIG.redirectUri,
    client_id: OAUTH_CONFIG.clientId,
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  console.log('[OAuth] 响应状态:', response.status, response.statusText)

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
      console.error('[OAuth] 错误响应:', errorData)
    } catch (e) {
      const text = await response.text()
      console.error('[OAuth] 错误响应（非JSON）:', text)
      throw new Error(`HTTP ${response.status}: ${text || '获取token失败'}`)
    }
    throw new Error(errorData.message || errorData.error_description || errorData.error || '获取token失败')
  }

  const result = await response.json()
  console.log('[OAuth] Token获取成功:', {
    hasAccessToken: !!result.access_token,
    hasRefreshToken: !!result.refresh_token,
    tokenType: result.token_type,
    expiresIn: result.expires_in,
  })
  
  return result
}

/**
 * 使用refresh_token刷新access_token
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise<Object>} token响应
 */
export async function refreshAccessToken(refreshToken) {
  console.log('[OAuth] refreshAccessToken 开始，refreshToken长度:', refreshToken ? refreshToken.length : 0)
  
  const formData = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: OAUTH_CONFIG.clientId,
    client_secret: process.env.VUE_APP_OAUTH_CLIENT_SECRET || '',
  })

  const tokenUrl = `${OAUTH_CONFIG.authorizationServer}/api/oauth/token`
  console.log('[OAuth] 刷新token请求URL:', tokenUrl)

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  console.log('[OAuth] 刷新token响应状态:', response.status, response.statusText)

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
      console.error('[OAuth] 刷新token错误响应:', errorData)
    } catch (e) {
      const text = await response.text()
      console.error('[OAuth] 刷新token错误响应（非JSON）:', text)
      throw new Error(`HTTP ${response.status}: ${text || '刷新token失败'}`)
    }
    throw new Error(errorData.message || errorData.error_description || errorData.error || '刷新token失败')
  }

  const tokenResponse = await response.json()
  console.log('[OAuth] Token刷新成功:', {
    hasAccessToken: !!tokenResponse.access_token,
    hasRefreshToken: !!tokenResponse.refresh_token,
  })
  
  // 更新token
  const authModule = await import('./auth')
  authModule.setToken(tokenResponse.access_token)
  console.log('[OAuth] 新access token已保存')
  
  if (tokenResponse.refresh_token) {
    authModule.setRefreshToken(tokenResponse.refresh_token)
    console.log('[OAuth] 新refresh token已保存')
  }
  
  return tokenResponse
}

/**
 * 检查URL中是否包含OAuth回调参数
 * @returns {Object|null} 包含code和state的对象，或null
 */
export function parseOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  const error = urlParams.get('error')
  const errorDescription = urlParams.get('error_description')

  if (error) {
    return { error, errorDescription }
  }

  if (code && state) {
    return { code, state }
  }

  return null
}
