export function deg2rad(n: number) {
  return n * (Math.PI / 180);
}

export function withinRadius(
  originLat: number,
  originLong: number,
  lat: number,
  long: number,
  radius: number
) {
  const R = 6371;

  const dLat = deg2rad(originLat - lat);
  const dLong = deg2rad(originLong - long);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat)) *
      Math.cos(deg2rad(originLat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  const distance = R * c;

  return {
    distance,
    result: distance <= radius / 1000,
  }; // m to km
}
