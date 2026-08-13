import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = body.raw_text || "";

    const titleMatch = rawText.match(/Title:\s*(.+)/i) || rawText.match(/Senior\s+[A-Za-z\s]+/i);
    const companyMatch = rawText.match(/Company:\s*(.+)/i) || rawText.match(/Webgility|StripeStream|Nexus/i);

    const commonKeywords = [
      "Ecommerce", "Accounting", "Shopify", "Amazon", "Walmart", "QuickBooks", "NetSuite",
      "B2B SaaS", "Agentic Workflows", "AI-Native", "PLG", "Customer Discovery", "PRD",
      "FastAPI", "Python", "Kafka", "Kubernetes", "AWS", "PostgreSQL", "React", "TypeScript"
    ];

    const detected = commonKeywords.filter((kw) =>
      new RegExp(`\\b${kw}\\b`, "i").test(rawText)
    );

    return NextResponse.json({
      status: "success",
      target_role: titleMatch ? titleMatch[0].replace(/Title:\s*/i, "").trim() : "Senior Product Manager",
      target_company: companyMatch ? companyMatch[0].replace(/Company:\s*/i, "").trim() : "Webgility",
      extracted_jd: {
        required_skills: detected.length > 0 ? detected : ["B2B SaaS", "Ecommerce", "Accounting", "AI-Native"],
        tools: ["Shopify", "QuickBooks", "NetSuite", "Amplitude", "Linear"],
        experience_years_required: 7,
        responsibilities: [
          "Own roadmap for AI-native ecommerce-to-accounting reconciliation workflows",
          "Drive customer discovery with US-based SMB sellers",
          "Partner with engineering and design to ship agentic features"
        ]
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
