const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://eqdksmvnliojdxfdvyjq.supabase.co'
const supabaseKey = 'sb_publishable_gJ7GUja0jBzSwTIlnpoAfw_oepMWkCc'

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

addRide()

async function getRides() {
  const { data, error } = await supabase
    .from('rides')
    .select('*')

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('All rides:')
    data.forEach(ride => {
      console.log(`${ride.rider_name}: ${ride.pickup} → ${ride.dropoff} $${ride.base_price}`)
    })
  }
}

getRides()
