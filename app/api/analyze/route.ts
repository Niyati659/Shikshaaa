import { NextRequest, NextResponse } from 'next/server';

const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE_MB = 10;
const VALID_CONDITIONS = ['Perfect', 'Good', 'Bad'] as const;
const VALID_ANSWERS    = ['Yes', 'No'] as const;

type Answer    = typeof VALID_ANSWERS[number];
type Condition = typeof VALID_CONDITIONS[number];

interface AnalysisResult {
  answer:    Answer;
  condition: Condition;
}

/** Strip ```json ... ``` fences Gemini sometimes wraps around JSON despite being told not to */
function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

/**
 * Parse and strictly validate the shape coming from Gemini.
 * THROWS if the response is malformed or contains unexpected values.
 * Never silently substitutes fake data — callers must handle the error.
 */
function parseGeminiResponse(text: string): AnalysisResult {
  const clean = stripJsonFences(text);

  let raw: unknown;
  try {
    raw = JSON.parse(clean);
  } catch {
    throw new Error(`Model returned non-JSON output: "${clean.slice(0, 120)}"`);
  }

  if (!raw || typeof raw !== 'object') {
    throw new Error('Model response is not a JSON object');
  }

  const obj = raw as Record<string, unknown>;

  if (!VALID_ANSWERS.includes(obj.answer as Answer)) {
    throw new Error(`Unexpected "answer" value from model: "${obj.answer}"`);
  }

  if (!VALID_CONDITIONS.includes(obj.condition as Condition)) {
    throw new Error(`Unexpected "condition" value from model: "${obj.condition}"`);
  }

  return {
    answer:    obj.answer    as Answer,
    condition: obj.condition as Condition,
  };
}

export async function POST(req: NextRequest) {
  // 1. API key guard
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[analyze] GEMINI_API_KEY is not set');
    return NextResponse.json(
      { error: 'Server misconfiguration: missing API key' },
      { status: 500 },
    );
  }

  // 2. Parse form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('image');
  const type = formData.get('type');

  // 3. Input validation
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }

  if (!type || typeof type !== 'string' || !type.trim()) {
    return NextResponse.json({ error: 'Facility type is required' }, { status: 400 });
  }

  if (!VALID_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Please upload a JPEG, PNG, or WebP image.` },
      { status: 400 },
    );
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return NextResponse.json(
      { error: `File too large (${fileSizeMB.toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE_MB} MB.` },
      { status: 400 },
    );
  }

  // 4. Convert to base64
  let base64: string;
  try {
    const bytes = await file.arrayBuffer();
    base64 = Buffer.from(bytes).toString('base64');
  } catch {
    return NextResponse.json({ error: 'Failed to read image file' }, { status: 500 });
  }

  // 5. Call Gemini
  let geminiResponse: Response;
  try {
    geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an expert Civil Infrastructure Auditor specialized in rural and government school environments. Your evaluation mindset is "Functional & Fair" rather than "Aesthetic."

Facility to check: ${type.trim()}

----------------------------------------
CRITICAL CONTEXT: GOVERNMENT SCHOOL REALITY
- Architecture may be aged, paint may be faded, and floors may be cement/stone rather than tile.
- A facility is "Good" if a child can safely use it TODAY.
- Ignore "aesthetic" wear and tear (peeling paint, dust on exterior, old-style taps).
----------------------------------------

STEP 1: DETECTION
- If the facility (or a clear part of it) is visible → "Yes"
- If the image is blurry but the silhouette of the facility is recognizable → "Yes"
- Only answer "No" if the facility is entirely missing from the frame.

STEP 2: CONDITION (THE "FUNCTIONAL" SCALE)
- "Perfect": Looks newly built/renovated. High-end finishes.
- "Good" (DEFAULT): The facility is usable. Even if it looks "old," if there are no major structural breaks or extreme filth, it is Good.
- "Bad": Structural collapse, blocked/overflowing toilets, or dangerous exposed high-voltage wiring.

STEP 3: SPECIFIC FACILITY CALIBRATION
- TOILET: If you see a pan, a door, or a stall it is "Yes." If it is dry and clear of debris it is "Good." Do NOT mark "Bad" just for stained ceramic or rustic walls.
- DRINKING WATER: Any tap, pump, or tank setup. If water is accessible it is "Good."
- ELECTRICITY: If a bulb, fan, or switchboard is visible it is "Yes." If it is not hanging by a single wire it is "Good."

STEP 4: FINAL OUTPUT
Return ONLY a raw JSON object. No prose. No markdown. No backticks. No extra keys.
Example of the exact format required: {"answer":"Yes","condition":"Good"}
                  `.trim(),
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );
  } catch (err) {
    console.error('[analyze] Network error calling Gemini:', err);
    return NextResponse.json(
      { error: 'Failed to reach the analysis service. Please try again.' },
      { status: 502 },
    );
  }

  // 6. Handle Gemini HTTP errors
  if (!geminiResponse.ok) {
    let geminiError = '';
    try {
      const errBody = await geminiResponse.json();
      geminiError = errBody?.error?.message ?? JSON.stringify(errBody);
    } catch {
      geminiError = await geminiResponse.text().catch(() => '');
    }
    console.error(`[analyze] Gemini returned ${geminiResponse.status}:`, geminiError);
    return NextResponse.json(
      { error: `Analysis service error (${geminiResponse.status}): ${geminiError || 'Unknown error'}` },
      { status: 502 },
    );
  }

  // 7. Parse Gemini response body
  let data: unknown;
  try {
    data = await geminiResponse.json();
  } catch {
    console.error('[analyze] Failed to parse Gemini JSON response');
    return NextResponse.json({ error: 'Invalid response from analysis service' }, { status: 502 });
  }

  const rawText: string =
    (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!rawText) {
    console.warn('[analyze] Gemini returned empty text. Full response:', JSON.stringify(data));
    const blockReason = (data as any)?.promptFeedback?.blockReason;
    if (blockReason) {
      return NextResponse.json(
        { error: `Image blocked by safety filter: ${blockReason}` },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: 'Analysis service returned an empty response.' },
      { status: 502 },
    );
  }

  // 8. Strictly validate model output — throw on anything unexpected.
  // The frontend will show an error banner. We never return fake data.
  try {
    const result = parseGeminiResponse(rawText);
    return NextResponse.json(result);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error('[analyze] Could not parse model output:', reason, '| raw:', rawText);
    return NextResponse.json(
      { error: `Could not parse analysis result: ${reason}` },
      { status: 502 },
    );
  }
}