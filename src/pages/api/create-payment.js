export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    
    const apiKey = import.meta.env.PAYPRO_API_KEY;
    const productId = import.meta.env.PAYPRO_PRODUCT_ID;
    const testMode = import.meta.env.PAYPRO_TEST_MODE === 'true';
    
    if (!apiKey || !productId) {
      console.error('[PayPro] API key or Product ID not configured');
      return new Response(JSON.stringify({ 
        error: 'Payment service not configured' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[PayPro] Creating product payment:', {
      productId,
      customer: data.customer?.email,
      testMode
    });

    const formData = new URLSearchParams();
    formData.append('apikey', apiKey);
    formData.append('command', 'create_product_payment');
    formData.append('product_id', productId);
    formData.append('consumer_email', data.customer?.email || '');
    
    if (data.pspCode) {
      formData.append('psp_code', data.pspCode);
    }
    
    if (testMode) {
      formData.append('test_mode', 'true');
    }
    
    if (data.orderDetails) {
      formData.append('custom', JSON.stringify(data.orderDetails));
    }

    console.log('[PayPro] Request body:', formData.toString());
    console.log('[PayPro] Sending request to PayPro API...');

    const response = await fetch('https://www.paypro.nl/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const responseText = await response.text();
    console.log('[PayPro] Raw response:', responseText);

    if (!response.ok) {
      console.error('[PayPro] API error:', response.status, responseText);
      return new Response(JSON.stringify({ 
        error: 'Payment creation failed',
        details: responseText
      }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('[PayPro] Failed to parse response:', e);
      return new Response(JSON.stringify({ 
        error: 'Invalid response from payment service' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[PayPro] Parsed response:', result);

    if (result.return?.payment_url) {
      console.log('[PayPro] Payment created successfully:', result.return.payment_url);
      return new Response(JSON.stringify({
        success: true,
        paymentUrl: result.return.payment_url
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (result.errors) {
      console.error('[PayPro] API returned errors:', result.errors);
      return new Response(JSON.stringify({
        error: 'Payment creation failed',
        details: result.errors
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('[PayPro] Unexpected response format:', result);
      return new Response(JSON.stringify({
        error: 'Unexpected response format',
        details: result
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('[PayPro] Error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
