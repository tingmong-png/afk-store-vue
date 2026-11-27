
export default async (req) => {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
  
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers }
      )
    }
  
    try {
      const {
        orderCode,
        robloxUsername,
        robloxUserId,
        displayName,
        packageRobux,
      } = await req.json()
  
      const packages = [50, 100, 200, 300, 400, 500, 1000]
  
      if (
        !orderCode ||
        typeof orderCode !== 'string' ||
        orderCode.length > 60 ||
        !robloxUsername ||
        typeof robloxUsername !== 'string' ||
        !packages.includes(Number(packageRobux))
      ) {
        return new Response(
          JSON.stringify({ error: 'Invalid order information' }),
          { status: 400, headers }
        )
      }
  
      const amount = Number(packageRobux) / 100
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SECRET_KEY
  
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Server database configuration is missing')
      }
  
      const response = await fetch(
        `${supabaseUrl}/rest/v1/orders`,
        {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            order_code: orderCode,
            roblox_username: robloxUsername,
            roblox_user_id: robloxUserId || null,
            display_name: displayName || null,
            package_robux: Number(packageRobux),
            amount,
          }),
        }
      )
  
      const result = await response.json()
  
      if (!response.ok) {
        console.error('Supabase order error:', result)
        return new Response(
          JSON.stringify({ error: 'Unable to save order' }),
          { status: 500, headers }
        )
      }
  
      return new Response(
        JSON.stringify({
          success: true,
          order: result[0],
        }),
        { status: 201, headers }
      )
    } catch (error) {
      console.error('Create order error:', error)
  
      return new Response(
        JSON.stringify({ error: 'Unable to create order' }),
        { status: 500, headers }
      )
    }
  }
  