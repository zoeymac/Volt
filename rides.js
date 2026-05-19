// An object represents one ride - like one row in your Volt Database
const ride1 = {
    riderName: "Sarah",
    pickup: "Union Station",
    dropoff: "Etobicoke",
    basePrice: 12.00,
    surgeMultiplier: 1.5,
    status: "completed"
}
const ride2 = {
    riderName: "Marcus",
    pickup: "Scarborough",
    dropoff: "Downtown Toronto",
    basePrice: 18.00,
    surgeMultiplier: 1.2,
    status: "completed"

}
const ride3 = {
    riderName: "Priya",
    pickup: "Mississauga",
    dropoff: "Airport",
    basePrice: 22.00,
    surgeMultiplier: 1.0,
    status: "completed"
}

// An array holds multiple rides - like a whole database table
const rideHistory = [ride1, ride2, ride3]

console.log(rideHistory)
console.log("First ride pickup: " + rideHistory[0].pickup)

for (let i =0; i < rideHistory.length; i++) {
    console.log(rideHistory[i].pickup)
}

