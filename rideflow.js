require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function riderRequestsRide() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'rider@volt.com', password: 'test1234'
  })
  const { data, error } = await supabase.from('rides').insert([{
    rider_name: 'Sarah', pickup: 'Union Station', dropoff: 'Etobicoke',
    base_price: 12.00, surge_multiplier: 1.5, status: 'searching',
    rider_id: authData.user.id
  }]).select()
  if (error) { console.log('Error:', error.message); return null }
  console.log('Ride requested! Status:', data[0].status)
  console.log('Ride ID:', data[0].id)
  return data[0].id
}

async function driverAcceptsRide(rideId) {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'driver@volt.com', password: 'test1234'
  })
  const { data, error } = await supabase.from('rides')
    .update({ driver_id: authData.user.id, status: 'in_progress' })
    .eq('id', rideId).select()
  if (error) { console.log('Error:', error.message); return }
  console.log('Driver accepted! Status:', data[0].status)
}

async function completeRide(rideId) {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'driver@volt.com', password: 'test1234'
  })
  const finalPrice = 12.00 * 1.5
  const platformFee = finalPrice * 0.03
  const driverEarnings = finalPrice - platformFee
  const { data, error } = await supabase.from('rides')
    .update({ status: 'completed' })
    .eq('id', rideId)
    .eq('driver_id', authData.user.id)
    .select()
  if (error) { console.log('Error:', error.message); return }
  console.log('Ride completed!')
  console.log('Final price: $' + finalPrice)
  console.log('Platform fee: $' + platformFee.toFixed(2))
  console.log('Driver earnings: $' + driverEarnings.toFixed(2))

}

async function runRideFlow() {
  console.log('--- VOLT RIDE FLOW ---')
  const rideId = await riderRequestsRide()
  if (rideId) await driverAcceptsRide(rideId)
  if (rideId) await completeRide(rideId)
}

runRideFlow()
