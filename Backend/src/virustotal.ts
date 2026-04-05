export async function fetchVirusTotal(indicator: string, type: string) {

  const url = `https://www.virustotal.com/api/v3/ip_addresses/${indicator}`;

  const response = await fetch(url, {
    headers: {
      "x-apikey": process.env.VT_API_KEY as string
    }
  });

  return await response.json();
}