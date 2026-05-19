function calculateFare(basePrice, surgeMultiplier, discountAmount) {
  if (surgeMultiplier < 1) {
    console.log("Error: surgeMultiplier cannot be less than 1")
    return null
  }
  if (discountAmount > basePrice) {
    console.log("Error: discountAmount cannot exceed basePrice")
    return null
  }
  const estimatedPrice = (basePrice * surgeMultiplier) - discountAmount
  return estimatedPrice
}

const fare1 = calculateFare(12.00, 1.5, 2.00)
const fare2 = calculateFare(8.00, 1.0, 0)
const fare3 = calculateFare(25.00, 2.0, 5.00)
const fare4 = calculateFare(12.00, -1, 0)
const fare5 = calculateFare(0, 1.5, 50)

console.log("Ride 1 fare: $" + fare1)
console.log("Ride 2 fare: $" + fare2)
console.log("Ride 3 fare: $" + fare3)
console.log("Ride 4 fare: $" + fare4)
console.log("Ride 5 fare: $" + fare5)
