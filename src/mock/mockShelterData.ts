function generateShelterData(name: string) {
  return {
    empty: false,
    map: {
      shelter: {
        empty: false,
        map: {
          name,
          lat: "34.2461",
          lon: "-77.9519"
        }
      }
    }
  };
}

export function getShelterData(id: string) {
  return generateShelterData("Port City Marina");
}
