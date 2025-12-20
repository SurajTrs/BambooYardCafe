import { Request, Response } from 'express';
import PaytmChecksum from 'paytmchecksum';

const PAYTM_CONFIG = {
  MID: process.env.PAYTM_MID || '',
  MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY || '',
  WEBSITE: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
  CHANNEL_ID: process.env.PAYTM_CHANNEL_ID || 'WEB',
  INDUSTRY_TYPE: process.env.PAYTM_INDUSTRY_TYPE || 'Retail',
  CALLBACK_URL: process.env.PAYTM_CALLBACK_URL || 'http://localhost:5001/api/payment/callback'
};

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, customerEmail, customerPhone } = req.body;

    const paytmParams: any = {
      body: {
        requestType: 'Payment',
        mid: PAYTM_CONFIG.MID,
        websiteName: PAYTM_CONFIG.WEBSITE,
        orderId: orderId,
        callbackUrl: PAYTM_CONFIG.CALLBACK_URL,
        txnAmount: {
          value: amount.toString(),
          currency: 'INR'
        },
        userInfo: {
          custId: customerEmail,
          mobile: customerPhone,
          email: customerEmail
        }
      }
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      PAYTM_CONFIG.MERCHANT_KEY
    );

    paytmParams.head = {
      signature: checksum
    };

    const isProduction = process.env.NODE_ENV === 'production';
    const paytmUrl = isProduction
      ? 'https://securegw.paytm.in/theia/api/v1/initiateTransaction'
      : 'https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction';

    res.json({
      success: true,
      paytmParams,
      paytmUrl,
      orderId
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ success: false, error: 'Payment initiation failed' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const paytmChecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    const isVerified = await PaytmChecksum.verifySignature(
      req.body,
      PAYTM_CONFIG.MERCHANT_KEY,
      paytmChecksum
    );

    if (isVerified) {
      const { ORDERID, STATUS, TXNID, TXNAMOUNT, RESPCODE, RESPMSG } = req.body;
      
      res.json({
        success: true,
        verified: true,
        orderId: ORDERID,
        status: STATUS,
        transactionId: TXNID,
        amount: TXNAMOUNT,
        responseCode: RESPCODE,
        message: RESPMSG
      });
    } else {
      res.json({
        success: false,
        verified: false,
        message: 'Checksum verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
};

export const handleCallback = (req: Request, res: Response) => {
  const paytmChecksum = req.body.CHECKSUMHASH;
  delete req.body.CHECKSUMHASH;

  PaytmChecksum.verifySignature(
    req.body,
    PAYTM_CONFIG.MERCHANT_KEY,
    paytmChecksum
  ).then((isVerified) => {
  if (isVerified) {
    const { ORDERID, STATUS, TXNID } = req.body;
    const redirectUrl = `http://localhost:5173/payment-status?orderId=${ORDERID}&status=${STATUS}&txnId=${TXNID}`;
    res.redirect(redirectUrl);
  } else {
    res.redirect('http://localhost:5173/payment-status?status=FAILED');
  }
  });
};

export const checkStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const paytmParams: any = {
      body: {
        mid: PAYTM_CONFIG.MID,
        orderId: orderId
      }
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      PAYTM_CONFIG.MERCHANT_KEY
    );

    paytmParams.head = {
      signature: checksum
    };

    const isProduction = process.env.NODE_ENV === 'production';
    const statusUrl = isProduction
      ? 'https://securegw.paytm.in/v3/order/status'
      : 'https://securegw-stage.paytm.in/v3/order/status';

    const response = await fetch(statusUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paytmParams)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ success: false, error: 'Status check failed' });
  }
};
