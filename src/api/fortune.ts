export interface FortuneResponse {
  grade: string;
  message: string;
}

export async function postFortune(seed: string, snacks: string[]): Promise<FortuneResponse> {
  const res = await fetch('/functions/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seed, snacks }),
  });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}