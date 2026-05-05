const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${API_KEY}`

export interface CriterionResult {
  status: 'pass' | 'fail'
  confidence: number
  note: string
}

export interface BidResult {
  id: string
  vendorName: string
  vendorNameKannada: string | null
  language: 'kannada' | 'english'
  bidAmount: string
  verdict: 'eligible' | 'ineligible' | 'review'
  confidence: number
  criteria: Record<string, CriterionResult>
  failReasons: string[]
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const PROMPT = `You are a Karnataka government tender evaluation AI (NEETHI AI).
Evaluate the attached bid document against the KTPP Act 2000 eligibility criteria.

Return ONLY a valid JSON object — no markdown, no explanation — in this exact shape:
{
  "verdict": "eligible" | "ineligible" | "review",
  "confidence": <integer 0-100>,
  "bidAmount": "<extracted bid amount string or 'Not specified'>",
  "language": "kannada" | "english",
  "vendorNameKannada": "<vendor name in Kannada script if present, else null>",
  "criteria": {
    "C1": { "status": "pass" | "fail", "confidence": <0-100>, "note": "<1-line evidence or reason>" },
    "C2": { "status": "pass" | "fail", "confidence": <0-100>, "note": "<1-line evidence or reason>" },
    "C3": { "status": "pass" | "fail", "confidence": <0-100>, "note": "<1-line evidence or reason>" },
    "C4": { "status": "pass" | "fail", "confidence": <0-100>, "note": "<1-line evidence or reason>" },
    "C5": { "status": "pass" | "fail", "confidence": <0-100>, "note": "<1-line evidence or reason>" },
    "C6": { "status": "pass" | "fail", "confidence": <0-100>, "note": "<1-line evidence or reason>" }
  },
  "failReasons": ["<reason string for each failed MANDATORY criterion>"]
}

Criteria definitions:
C1 [MANDATORY] Annual Turnover: minimum Rs.5 Crore per year for last 3 consecutive financial years
C2 [MANDATORY] ISO 9001:2015 Certification: valid, current certificate
C3 [MANDATORY] PWD Registration: valid Karnataka PWD Class I contractor registration
C4 [MANDATORY] Prior Experience: minimum 5 years in road/infrastructure projects above Rs.10 Crore each
C5 [OPTIONAL]  GST Registration: valid GSTIN
C6 [OPTIONAL]  Bonded Labour Compliance: BLS Abolition Act compliance certificate

Verdict rules:
- "eligible": all 4 mandatory criteria (C1-C4) pass
- "ineligible": any mandatory criterion fails with confidence >= 80
- "review": any mandatory criterion status is unclear or confidence < 70

If the document has insufficient information to assess a criterion, set status "fail" and confidence < 60, and note "Insufficient information".`

export async function evaluateBid(
  bidId: string,
  bidderName: string,
  file: File
): Promise<BidResult> {
  const base64 = await fileToBase64(file)
  const mimeType = file.type || 'application/pdf'

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: PROMPT },
        ],
      }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty response from Gemini')

  const result = JSON.parse(text)

  return {
    id: bidId,
    vendorName: bidderName,
    vendorNameKannada: result.vendorNameKannada ?? null,
    language: result.language ?? 'english',
    bidAmount: result.bidAmount ?? 'Not specified',
    verdict: result.verdict ?? 'review',
    confidence: result.confidence ?? 50,
    criteria: result.criteria ?? {},
    failReasons: result.failReasons ?? [],
  }
}
