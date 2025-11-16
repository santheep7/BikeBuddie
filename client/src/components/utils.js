const locations = {
    Kakkanad: { lat: 10.0162, lng: 76.3406 },
    Vytilla: { lat: 9.9754, lng: 76.3149 },
    "Fort Kochi": { lat: 9.9656, lng: 76.2169 },
    "MG Road": { lat: 9.9467, lng: 76.2771 },
    Palarivattom: { lat: 10.0133, lng: 76.3285 },
    Edapally: { lat: 10.0323, lng: 76.2969 },
    Aluva: { lat: 10.1417, lng: 76.3507 },
    // Add more places here with their lat/lng
  };
  
  export const haversineDistance = (startLocation, endLocation) => {
    const start = locations[startLocation];
    const end = locations[endLocation];
  
    if (!start || !end) {
      throw new Error("Invalid location(s) provided");
    }
  
    const toRad = (x) => (x * Math.PI) / 180;
  
    const lat1 = toRad(start.lat);
    const lat2 = toRad(end.lat);
    const lon1 = toRad(start.lng);
    const lon2 = toRad(end.lng);
  
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const R = 6371; // Earth radius in kilometers
    const distance = R * c;
  
    return distance;
  };
  