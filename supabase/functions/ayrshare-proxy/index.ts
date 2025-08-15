import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
// @deno-types="npm:@types/node"
import SocialPost from "social-media-api"

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

    // Initialize the official Ayrshare SDK
    const social = new SocialPost(apiKey)

    let result

    // Route actions to appropriate SDK methods
    switch (action) {
      case 'getConnectedAccounts':
        result = await social.getProfiles()
        break

      case 'generateAuthUrl':
        result = await social.generateJWT({
          domain: req.headers.get('origin') || 'localhost',
          platforms: [params.platform]
        })
        break

      case 'createPost':
        result = await social.post(params.postData)
        break

      case 'getPostHistory':
        const limit = params.params?.limit || 20
        result = await social.getHistory({ lastRecords: limit })
        break

      case 'deletePost':
        result = await social.deletePost(params.postId)
        break

      case 'getAnalytics':
        const { startDate, endDate } = params.params
        result = await social.getAnalytics({
          startDate,
          endDate
        })
        break

      case 'uploadMedia':
        result = await social.upload({
          file: params.file,
          fileName: params.fileName,
          description: `Uploaded via ContentFlow: ${params.fileName}`
        })
        break

      default:
        throw new Error(`Unsupported action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Ayrshare proxy error:', error)

    // Enhanced error handling with specific error types
    const status = error.response?.status || 500
    const errorResponse = {
      error: error.message || 'Unknown error occurred',
      status,
      action,
      timestamp: new Date().toISOString()
    }

    // Log additional details for debugging
    if (error.response) {
      console.error('Ayrshare API Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      })
    }

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: status >= 400 && status < 600 ? status : 500,
      },
    )
  }
})
