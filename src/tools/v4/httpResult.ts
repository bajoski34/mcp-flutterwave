export async function v4JsonResult(
  response: Response,
  failureLabel: string,
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const raw = await response.text();
  if (!response.ok) {
    throw new Error(
      `Flutterwave v4 ${failureLabel} request failed: ${response.status} ${raw}`,
    );
  }

  let payload: unknown = raw;
  try {
    payload = raw === '' ? null : JSON.parse(raw);
  } catch {
    payload = raw;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          { status: response.status, body: payload },
          null,
          2,
        ),
      },
    ],
  };
}

export function toQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query === '' ? '' : `?${query}`;
}
