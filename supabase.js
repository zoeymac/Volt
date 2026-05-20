require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function addRide() {
  const { data, error } = await supabase
    .from('rides')
    .insert([{
      rider_name: 'Sarah',
      pickup: 'Union Station',
      dropoff: 'Etobicoke',
      base_price: 12.00,
      surge_multiplier: 1.5,
      status: 'completed'
    }])
    .select()

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Ride added:', data)
  }
}

async function getRides() {
  const { data, error } = await supabase
    .from('rides')
    .select('*')

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('All rides:')
    data.forEach(ride => {
      console.log(`${ride.rider_name}: ${ride.pickup} to ${ride.dropoff} $${ride.base_price}`)
    })
  }
}

getRides()
