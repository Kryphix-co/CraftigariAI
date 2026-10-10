import re
from app.core.config import Settings
from app.schemas.deal_saathi import DealSaathiData, DealSaathiRequest, KeyTakeaway
from app.services.errors import AIServiceError

DEAL_SAATHI_SYSTEM_INSTRUCTION = """
You are Deal Saathi (डील साथी), an AI communication and negotiation assistant for Indian artisans on Craftigari.
Your job is to help the artisan understand buyer inquiries, summarize buyer requirements in clear simple words, and prepare polite, professional responses.
Rules:
- Explain what the buyer wants in simple, respectful language (Hindi or English as requested).
- Break down key points: quantity, timeline, customization, location/delivery, bulk discounts.
- Suggest a polite, respectful reply that the artisan can review and edit.
- Never invent confirmed discounts, delivery promises, product stock, costs, or commitments that the artisan did not specify.
- Never autonomously accept offers or agree to prices.
- Identify 1-3 useful questions the artisan might need to ask the buyer (e.g. delivery date, packaging preferences, exact customization details).
""".strip()


def _build_fallback_deal_saathi(request: DealSaathiRequest) -> DealSaathiData:
    msg = request.buyer_message.lower()
    is_hindi = request.language.startswith("hi")

    # Extract quantity if not given
    qty = request.quantity
    if not qty:
        qty_match = re.search(r"(\d+)\s*(?:pieces|pcs|units|items|पीस|यूनिट)", msg)
        if qty_match:
            try:
                qty = int(qty_match.group(1))
            except ValueError:
                qty = None

    takeaways: list[KeyTakeaway] = []
    if qty:
        label = "मात्रा (Quantity)" if is_hindi else "Quantity"
        val = f"{qty} पीस" if is_hindi else f"{qty} units"
        tag = "बड़ा ऑर्डर" if (qty >= 50 and is_hindi) else ("Bulk order" if qty >= 50 else None)
        takeaways.append(KeyTakeaway(label=label, value=val, tag=tag))

    if request.proposed_price:
        label = "प्रस्तावित दर (Proposed Price)" if is_hindi else "Proposed Price"
        val = f"₹{request.proposed_price} / पीस" if is_hindi else f"₹{request.proposed_price} / unit"
        takeaways.append(KeyTakeaway(label=label, value=val, tag="खरीदार का प्रस्ताव" if is_hindi else "Buyer Offer"))

    # Customization detection
    if any(k in msg for k in ["custom", "colour", "color", "red", "finish", "बदलाव", "रंग", "डिज़ाइन"]):
        label = "कस्टमाइज़ेशन (Customization)" if is_hindi else "Customization"
        val = "विशेष रंग या फिनिश की मांग" if is_hindi else "Custom finish or design requested"
        takeaways.append(KeyTakeaway(label=label, value=val, tag="कस्टम" if is_hindi else "Custom"))

    # Timeline detection
    timeline_match = re.search(r"(\d+)\s*(?:days|दिन)", msg)
    if timeline_match or any(k in msg for k in ["urgent", "within", "timeline", "जल्द", "दिन"]):
        label = "समय सीमा (Timeline)" if is_hindi else "Timeline"
        days_str = f"{timeline_match.group(1)} दिन" if timeline_match else ("15 दिन" if is_hindi else "15 days")
        takeaways.append(KeyTakeaway(label=label, value=days_str, tag="समय सीमा" if is_hindi else "Timeline"))

    # Location detection
    if any(k in msg for k in ["mumbai", "delhi", "bangalore", "delivery", "shipping", "डिलीवरी"]):
        label = "डिलीवरी (Delivery)" if is_hindi else "Delivery"
        val = "डिलीवरी स्थान और शुल्क स्पष्ट करें" if is_hindi else "Confirm delivery location & freight"
        takeaways.append(KeyTakeaway(label=label, value=val))

    if not takeaways:
        takeaways.append(
            KeyTakeaway(
                label="पूछताछ विवरण" if is_hindi else "Inquiry Details",
                value="विस्तृत आवश्यकताएं संदेश में देखें" if is_hindi else "Review full details in message",
            )
        )

    if is_hindi:
        summary = f"खरीदार ने {request.product_title or 'उत्पाद'} के लिए रुचि दिखाई है।"
        explanation = (
            f"खरीदार आपके उत्पाद {request.product_title or ''} के बारे में पूछताछ कर रहे हैं। "
            f"कृपया मात्रा, डिलीवरी समय और दर की पुष्टि करके अपना कोटेशन भेजें।"
        )
        suggested_reply = (
            f"नमस्ते, {request.product_title or 'उत्पाद'} में आपकी रुचि के लिए धन्यवाद। "
            f"हम आपके ऑर्डर पर काम करने के लिए तैयार हैं। कृपया डिलीवरी की अंतिम तारीख और सटीक पता साझा करें ताकि हम सही कोटेशन दे सकें।"
        )
        counter_advice = "अपने घोषित उत्पादन लागत से नीचे मोलभाव न करें। फेयर डील शील्ड की जांच करके ही अंतिम दर तय करें।"
        questions = [
            "क्या आपको किसी विशेष तारीख तक डिलीवरी चाहिए?",
            "क्या पैकेजिंग या फिनिशिंग में कोई विशेष बदलाव की आवश्यकता है?",
        ]
    else:
        summary = f"Buyer inquired about {request.product_title or 'your product'}."
        explanation = (
            f"The buyer is requesting details regarding {request.product_title or 'your craft'}. "
            f"Review the required quantity and timeline before issuing a formal quotation."
        )
        suggested_reply = (
            f"Hello, thank you for your interest in our handcrafted {request.product_title or 'products'}. "
            f"We would be delighted to fulfill your request. Could you please confirm your target delivery date and shipping address?"
        )
        counter_advice = "Ensure your unit price covers production costs and includes a fair profit margin."
        questions = [
            "What is your required delivery deadline?",
            "Do you have any specific customization or packaging preferences?",
        ]

    return DealSaathiData(
        summary=summary,
        explanation=explanation,
        key_takeaways=takeaways,
        suggested_reply=suggested_reply,
        counter_offer_advice=counter_advice,
        questions_to_ask=questions,
    )


async def generate_deal_saathi(request: DealSaathiRequest, settings: Settings) -> DealSaathiData:
    if not settings.gemini_api_key:
        return _build_fallback_deal_saathi(request)

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=settings.gemini_api_key)
    async_client = client.aio

    prompt = (
        f"Output language: {request.language} (hi for Hindi, en for English).\n"
        f"Product Title: {request.product_title or '[Not specified]'}\n"
        f"Quantity requested: {request.quantity or '[Not specified]'}\n"
        f"Buyer proposed price per unit: {request.proposed_price or '[None proposed]'}\n"
        f"Buyer message:\n\"\"\"{request.buyer_message}\"\"\"\n\n"
        "Analyze this buyer inquiry and return structured Deal Saathi guidance for the artisan."
    )

    try:
        response = await async_client.models.generate_content(
            model=settings.gemini_model,
            contents=[DEAL_SAATHI_SYSTEM_INSTRUCTION, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DealSaathiData,
                temperature=0.2,
                max_output_tokens=2000,
            ),
        )
        if isinstance(response.parsed, DealSaathiData):
            return response.parsed
        if response.parsed:
            return DealSaathiData.model_validate(response.parsed)
        return DealSaathiData.model_validate_json(response.text)
    except Exception:
        # Graceful fallback when Gemini quota/timeout occurs
        return _build_fallback_deal_saathi(request)
    finally:
        await async_client.aclose()
