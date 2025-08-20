// Simple geolocation helpers for portfolio/demo use
// Uses the browser Geolocation API + a free reverse geocode endpoint (BigDataCloud)

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export async function detectCityName() {
  try {
    const pos = await getCurrentPosition({ enableHighAccuracy: false, timeout: 8000 });
    const { latitude, longitude } = pos.coords;
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Reverse geocode failed");
    const data = await res.json();
    // Prefer city/locality; fall back to principalSubdivision (state) or countryName
    const candidates = [data.city, data.locality, data.principalSubdivision, data.countryName].filter(Boolean);
    return candidates[0] || "Unknown";
  } catch (e) {
    return null;
  }
}
