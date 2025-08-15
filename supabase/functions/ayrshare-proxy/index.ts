import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const AYRSHARE_API_URL = 'https://app.ayrshare.com/api'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    // Get Ayrshare API key from environment
    const apiKey = Deno.env.get('AYRSHARE_API_KEY')
    if (!apiKey) {
      throw new Error('AYRSHARE_API_KEY not configured')
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }

    let response
    let endpoint = ''
    let method = 'GET'
    let body = null

    // Route actions to appropriate Ayrshare API endpoints
    switch (action) {
      case 'getConnectedAccounts':
        endpoint = '/profiles'
        break
        
      case 'generateAuthUrl':
        endpoint = '/generate-jwt'
        method = 'POST'
        body = JSON.stringify({
          domain: req.headers.get('origin') || 'localhost',
          platforms: [params.platform]
        })
        break
        
      case 'createPost':
        endpoint = '/post'
        method = 'POST'
        body = JSON.stringify(params.postData)
        break
        
      case 'getPostHistory':
        const limit = params.params?.limit || 20
        endpoint = `/history?lastRecords=${limit}`
        break
        
      case 'deletePost':
        endpoint = `/delete/${params.postId}`
        method = 'DELETE'
        break
        
      case 'getAnalytics':
        const { startDate, endDate } = params.params
        endpoint = `/analytics?startDate=${startDate}&endDate=${endDate}`
        break
        
      case 'uploadMedia':
        endpoint = '/upload'
        method = 'POST'
        body = JSON.stringify({
          file: params.file,
          fileName: params.fileName,
          fileType: params.fileType
        })
        break
        
      default:
        throw new Error(`Unsupported action: ${action}`)
    }

    // Make request to Ayrshare API
    const ayrshareResponse = await fetch(`${AYRSHARE_API_URL}${endpoint}`, {
      method,
      headers,
      body
    })

    const data = await ayrshareResponse.json()

    if (!ayrshareResponse.ok) {
      throw new Error(data.message || `Ayrshare API error: ${ayrshareResponse.status}`)
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Ayrshare proxy error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to send a request to the Edge Function'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
