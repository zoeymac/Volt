require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function signInAndAddRide() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'rider@volt.com',
    password: 'test1234'
  })

  if (authError) {
    console.log('Login error:', authError.message)
    return
  }

  console.log('Logged in:', authData.user.email)

  const { data, error } = await supabase
    .from('rides')
    .insert([{
      rider_name: 'Sarah',
      pickup: 'Union Station',
      dropoff: 'Etobicoke',
      base_price: 12.00,
      surge_multiplier: 1.5,
      status: 'completed',
      rider_id: authData.user.id
    }])
    .select()

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Ride added with user ID:', data[0].rider_id)
  }
}

signInAndAddRide()
