function generateVictimData(name: string, status: string) {
  return {
    empty: false,
    map: {
      victims: {
        empty: false,
        list: [
          {
            empty: false,
            map: {
              id: "id-111",
              victimName: name,
              victimPhoneNumber: "(123) 456-7890:",
              status,
              lat: "34.14",
              lon: "-77.89",
              medicalNeeded: true,
              numberOfPeople: 5,
              timeStamp: Date.now()
            }
          }
        ]
      }
    }
  };
}

const victimState = {
  test1: "REPORTED",
  test2: "ASSIGNED",
  test3: "PICKEDUP",
  test4: "RESCUED"
} as {
  [key: string]: string;
};

export function getVictimData(name: string) {
  if (name in victimState) {
    return generateVictimData(name, victimState[name]);
  }
  return {
    empty: false,
    map: {
      victims: {
        empty: true,
        list: []
      }
    }
  };
}
