import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

const API_BASE = "http://localhost:4000";
const AI_BASE = "http://localhost:8000";
const TEST_PHONE = "+919999999999";

async function runE2ETest() {
  console.log("=== STARTING CRAFTIGARI LIVE END-TO-END VERIFICATION ===\n");

  // Step 1: Health Checks
  console.log("1. Checking service health...");
  const apiHealth = await fetch(`${API_BASE}/health`).then((r) => r.json());
  assert.equal(apiHealth.status, "ok", "Express API must be healthy");

  const aiHealth = await fetch(`${AI_BASE}/health`).then((r) => r.json());
  assert.equal(aiHealth.data?.status, "healthy", "FastAPI must be healthy");
  console.log("✔ Express API (4000) and FastAPI (8000) are healthy.\n");

  // Step 2: Artisan Authentication
  console.log("2. Testing Artisan OTP Authentication...");
  let sendOtpRes = await fetch(`${API_BASE}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: TEST_PHONE }),
  });
  if (sendOtpRes.status === 429) {
    const err = await sendOtpRes.json();
    const waitSec = (err?.error?.details?.[0]?.retryAfterSeconds || 30) + 1;
    console.log(`⏳ Waiting ${waitSec}s for OTP resend cooldown...`);
    await new Promise((r) => setTimeout(r, waitSec * 1000));
    sendOtpRes = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: TEST_PHONE }),
    });
  }
  assert.ok(sendOtpRes.status === 200 || sendOtpRes.status === 201, "Send OTP should succeed");
  const sendOtpData = await sendOtpRes.json();
  const demoOtp = sendOtpData.data.demoOtp;
  assert.ok(demoOtp, "Test phone should return demo OTP");

  // Verify OTP & extract session cookie
  const verifyOtpRes = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: TEST_PHONE, otp: demoOtp }),
  });
  assert.equal(verifyOtpRes.status, 200, "Verify OTP should succeed");
  const cookieHeader = verifyOtpRes.headers.get("set-cookie");
  assert.ok(cookieHeader, "Session cookie must be returned");
  const sessionCookie = cookieHeader.split(";")[0];
  const authHeaders = {
    Cookie: sessionCookie,
    "Content-Type": "application/json",
  };

  // Get Artisan profile
  const meRes = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeaders });
  assert.equal(meRes.status, 200);
  let artisan = (await meRes.json()).data.artisan;
  console.log(`✔ Artisan authenticated successfully: ${artisan.phone}`);

  // Complete profile if needed
  if (!artisan.name) {
    const updateProfileRes = await fetch(`${API_BASE}/api/artisans/me`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Master Rameshwar",
        location: "Khurja, Uttar Pradesh",
        craftSpecialization: "Terracotta & Blue Pottery",
      }),
    });
    artisan = (await updateProfileRes.json()).data;
    console.log(`✔ Profile updated: ${artisan.name} (${artisan.location})\n`);
  } else {
    console.log(`✔ Profile active: ${artisan.name}\n`);
  }

  // Step 3: Test Sarvam AI Voice Translation through Express
  console.log("3. Testing Sarvam AI Translation via Express proxy...");
  const translateRes = await fetch(`${API_BASE}/api/ai/translate`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      text: "यह हस्तनिर्मित मिट्टी का घड़ा है।",
      sourceLanguage: "hi",
      targetLanguage: "en",
    }),
  });
  assert.equal(translateRes.status, 200, "Sarvam translation should succeed");
  const translateData = await translateRes.json();
  assert.ok(translateData.data?.translatedText, "Translated text must be returned");
  console.log(`✔ Sarvam translation successful: "${translateData.data.translatedText}"\n`);

  // Step 4: Test Smart Pricing Calculation
  console.log("4. Testing Smart Pricing Assistant...");
  const pricingRes = await fetch(`${API_BASE}/api/products/calculate-pricing`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      materialCost: 200,
      labourCost: 400,
      packagingCost: 50,
      profitPercentage: 30,
    }),
  });
  assert.equal(pricingRes.status, 200);
  const pricingData = (await pricingRes.json()).data;
  // Cost = 200 + (4*100) + 50 = 650. Price with 30% markup = 650 * 1.30 = 845
  assert.equal(pricingData.totalCost, 650);
  assert.equal(pricingData.suggestedPrice, 845);
  console.log(`✔ Smart Pricing verified: Cost ₹${pricingData.totalCost} → Suggested Price ₹${pricingData.suggestedPrice}\n`);

  // Step 5: Product Publishing to MongoDB
  console.log("5. Publishing real product to MongoDB...");
  const draftRes = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: "Khurja Terracotta Royal Planter",
      description: "Authentic handmade terracotta planter crafted using high-fire clay.",
      category: "Home & Living",
      craftType: "Terracotta Pottery",
      materials: ["Terracotta Clay"],
      price: 845,
      images: [
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
      ],
      pricing: {
        materialCost: 200,
        labourCost: 400,
        packagingCost: 50,
        otherExpenses: 0,
        totalCost: 650,
        profitPercentage: 30,
        suggestedPrice: 845,
      },
      makingProcess: [
        {
          id: "step-1",
          stage: "preparation",
          title: "Clay Preparation",
          description: "Fine terracotta clay is purified and kneaded.",
          order: 0,
        },
        {
          id: "step-2",
          stage: "shaping",
          title: "Potter Wheel Shaping",
          description: "Shaped on a traditional wheel by hand.",
          order: 1,
        },
      ],
    }),
  });
  assert.equal(draftRes.status, 201, "Product draft should be created in MongoDB");
  const draft = (await draftRes.json()).data;
  const prodId = draft.id;
  assert.ok(prodId, "Draft product must have an ID");

  // Publish draft
  const publishRes = await fetch(`${API_BASE}/api/products/${prodId}/publish`, {
    method: "POST",
    headers: authHeaders,
  });
  assert.equal(publishRes.status, 200, "Product draft should publish successfully");
  const product = (await publishRes.json()).data;
  assert.equal(product.status, "published");
  console.log(`✔ Product published to MongoDB: #${prodId} ("${product.title}")`);

  // Verify Marketplace Visibility & Private Cost Stripping
  const publicProductRes = await fetch(`${API_BASE}/api/products/published/${prodId}`);
  assert.equal(publicProductRes.status, 200);
  const publicProduct = (await publicProductRes.json()).data;
  assert.equal(publicProduct.id, prodId);
  assert.equal(publicProduct.pricing, undefined, "Private production costs MUST NOT be exposed publicly!");
  console.log("✔ Marketplace visibility verified; private costs safely hidden from buyers.\n");

  // Step 6: Buyer Inquiry Submission
  console.log("6. Submitting Buyer Inquiry...");
  const inquiryRes = await fetch(`${API_BASE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: prodId,
      buyerName: "Radha Interiors",
      buyerContact: {
        phone: "9876500000",
        email: "radha@interiors.test",
        organization: "Radha Design Studio",
      },
      quantity: 50,
      proposedPrice: 800,
      buyerMessage: "Need 50 pieces of the Khurja planter with dark finish delivered in 15 days.",
      expectedTimeline: "15 Days",
    }),
  });
  assert.equal(inquiryRes.status, 201, "Buyer inquiry should be created");
  const inquiryData = (await inquiryRes.json()).data;
  const inquiry = inquiryData.inquiry;
  const buyerAccessToken = inquiryData.accessToken;
  assert.ok(buyerAccessToken, "Guest buyer access token must be provided");
  console.log(`✔ Inquiry #${inquiry.inquiryId} submitted by ${inquiry.buyerName} for 50 pieces @ ₹800\n`);

  // Step 7: Fair Deal Shield Evaluation
  console.log("7. Evaluating offer with Fair Deal Shield...");
  const fairDealRes = await fetch(`${API_BASE}/api/inquiries/${inquiry.inquiryId}/fair-deal`, {
    headers: authHeaders,
  });
  assert.equal(fairDealRes.status, 200);
  const fairDeal = (await fairDealRes.json()).data;
  assert.equal(fairDeal.status, "profitable", "₹800 offer vs ₹650 cost is profitable");
  assert.equal(fairDeal.profitAmount, 150);
  console.log(`✔ Fair Deal Shield verified: Offer ₹800 is profitable (+₹150/unit profit over declared cost ₹650).\n`);

  // Step 8: Deal Saathi AI Guidance
  console.log("8. Generating Deal Saathi guidance for inquiry...");
  const dealSaathiRes = await fetch(`${API_BASE}/api/inquiries/${inquiry.inquiryId}/deal-saathi`, {
    method: "POST",
    headers: authHeaders,
  });
  assert.equal(dealSaathiRes.status, 200);
  const dealSaathi = (await dealSaathiRes.json()).data;
  assert.ok(dealSaathi.summary, "Deal Saathi must return summary");
  assert.ok(dealSaathi.suggestedReply, "Deal Saathi must return suggested reply");
  console.log(`✔ Deal Saathi generated advice: "${dealSaathi.summary.slice(0, 80)}..."\n`);

  // Step 9: Artisan Creates and Issues Quotation
  console.log("9. Artisan creates official Quotation...");
  const quoteRes = await fetch(`${API_BASE}/api/quotations`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      inquiryId: inquiry.inquiryId,
      quantity: 50,
      unitPrice: 800,
      discount: 1000, // Total = (50 * 800) - 1000 = 39,000
      timeline: "15 Days",
      customization: "Dark terracotta finish",
      notes: "Custom batch ready for kiln firing.",
    }),
  });
  assert.equal(quoteRes.status, 201);
  const quoteData = (await quoteRes.json()).data;
  const quotation = quoteData.quotation;
  const quotationToken = quoteData.accessToken;
  assert.equal(quotation.finalAmount, 39000);
  console.log(`✔ Quotation #${quotation.quotationId} issued: ₹${quotation.finalAmount} (50 pcs @ ₹800 - ₹1000 discount)\n`);

  // Step 10: Buyer Reviews and Accepts Quotation
  console.log("10. Buyer reviews and accepts Quotation...");
  const acceptRes = await fetch(
    `${API_BASE}/api/quotations/${quotation.quotationId}/status?token=${quotationToken}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    },
  );
  assert.equal(acceptRes.status, 200);
  const acceptedQuote = (await acceptRes.json()).data;
  assert.equal(acceptedQuote.status, "accepted");
  console.log(`✔ Quotation #${quotation.quotationId} accepted by buyer.\n`);

  // Step 11: Buyer Proceeds to Payment (Razorpay Order Initiation)
  console.log("11. Initiating Razorpay payment checkout...");
  const initPayRes = await fetch(
    `${API_BASE}/api/payments/initiate?token=${quotationToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: quotation.quotationId,
        deliveryAddress: {
          name: "Radha Interiors",
          phone: "9876500000",
          street: "14 Nariman Point",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400021",
        },
      }),
    },
  );
  assert.equal(initPayRes.status, 201);
  const checkoutData = (await initPayRes.json()).data;
  assert.ok(checkoutData.razorpayOrderId.startsWith("order_"), "Real Razorpay order must be created");
  // 39000 rupees = 3900000 paise
  assert.equal(checkoutData.amount, 3900000);
  assert.equal(checkoutData.finalAmount, 39000);
  assert.ok(checkoutData.orderNumber.startsWith("ORD-"));
  console.log(`✔ Razorpay Order #${checkoutData.razorpayOrderId} created for ₹${checkoutData.finalAmount} (amount in paise: ${checkoutData.amount})`);
  console.log(`✔ Draft Craftigari Order created: ${checkoutData.orderNumber}\n`);

  // Step 12: Payment Verification
  console.log("12. Verifying Payment with Razorpay Signature...");
  const rzpPaymentId = `pay_mock_${Date.now()}`;
  const validSignature = createHmac("sha256", "q1KZC3jUMddNSyBSHxG1thWl")
    .update(`${checkoutData.razorpayOrderId}|${rzpPaymentId}`)
    .digest("hex");

  const verifyPayRes = await fetch(
    `${API_BASE}/api/payments/verify?token=${quotationToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: quotation.quotationId,
        orderNumber: checkoutData.orderNumber,
        razorpayOrderId: checkoutData.razorpayOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: validSignature,
      }),
    },
  );
  assert.equal(verifyPayRes.status, 200);
  const verifyData = (await verifyPayRes.json()).data;
  assert.equal(verifyData.order.paymentStatus, "paid");
  assert.equal(verifyData.order.orderStatus, "confirmed");
  console.log(`✔ Payment verified & Order #${checkoutData.orderNumber} confirmed in MongoDB!\n`);

  // Step 13: Order Visibility for Buyer and Artisan
  console.log("13. Testing Order Visibility...");
  // Guest Buyer view
  const buyerOrderRes = await fetch(
    `${API_BASE}/api/orders/${checkoutData.orderNumber}?token=${quotationToken}`,
  );
  assert.equal(buyerOrderRes.status, 200);
  const buyerOrder = (await buyerOrderRes.json()).data;
  assert.equal(buyerOrder.totalAmount, 39000);
  assert.equal(buyerOrder.paymentStatus, "paid");
  console.log(`✔ Buyer securely accessed Order #${buyerOrder.orderNumber}`);

  // Artisan view
  const artisanOrdersRes = await fetch(`${API_BASE}/api/orders`, { headers: authHeaders });
  assert.equal(artisanOrdersRes.status, 200);
  const artisanOrders = (await artisanOrdersRes.json()).data.orders;
  const foundOrder = artisanOrders.find((o) => o.orderNumber === checkoutData.orderNumber);
  assert.ok(foundOrder, "Confirmed order must appear in artisan orders dashboard");
  console.log(`✔ Artisan dashboard lists Order #${foundOrder.orderNumber} with paid badge.`);

  // Step 14: Artisan Fulfillment Status Progression
  console.log("14. Artisan progresses fulfillment status...");
  const progressRes = await fetch(
    `${API_BASE}/api/orders/${checkoutData.orderNumber}/status`,
    {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ orderStatus: "processing" }),
    },
  );
  assert.equal(progressRes.status, 200);
  const progressedOrder = (await progressRes.json()).data;
  assert.equal(progressedOrder.orderStatus, "processing");
  assert.equal(progressedOrder.paymentStatus, "paid", "Payment status must remain paid!");
  console.log(`✔ Order fulfillment status updated to 'processing'.\n`);

  // Step 15: Failure Case Checks
  console.log("15. Checking Key Security & Failure Cases...");
  // A. Invalid OTP
  const badOtpRes = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: TEST_PHONE, otp: "000000" }),
  });
  assert.equal(badOtpRes.status, 401, "Invalid OTP must reject with 401");

  // B. Invalid quotation access token
  const badTokenRes = await fetch(`${API_BASE}/api/quotations/${quotation.quotationId}?token=bad_token`);
  assert.equal(badTokenRes.status, 403, "Invalid token must reject with 403");

  // C. Bad payment signature
  const badSigRes = await fetch(`${API_BASE}/api/payments/verify?token=${quotationToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quotationId: quotation.quotationId,
      orderNumber: checkoutData.orderNumber,
      razorpayOrderId: checkoutData.razorpayOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: "fake_invalid_signature_123",
    }),
  });
  assert.equal(badSigRes.status, 400, "Bad signature must reject with 400");

  // D. Duplicate payment callback handled idempotently
  const dupVerifyRes = await fetch(`${API_BASE}/api/payments/verify?token=${quotationToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quotationId: quotation.quotationId,
      orderNumber: checkoutData.orderNumber,
      razorpayOrderId: checkoutData.razorpayOrderId,
      razorpayPaymentId: rzpPaymentId,
      razorpaySignature: validSignature,
    }),
  });
  assert.equal(dupVerifyRes.status, 200);
  const dupData = (await dupVerifyRes.json()).data;
  assert.equal(dupData.alreadyProcessed, true, "Duplicate callback must be idempotent");

  console.log("✔ All security and failure cases passed.\n");
  console.log("=========================================================");
  console.log("🎉 ALL E2E JOURNEY & INTEGRATION TESTS COMPLETED SUCCESSFULLY!");
  console.log("=========================================================");
}

runE2ETest().catch((err) => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});
