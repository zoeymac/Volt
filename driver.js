require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

async function createDriver() {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'driver@volt.com',
    password: 'test1234'
  })

  if (authError) {
    console.log('Signup error:', authError.message)
    return
  }

  console.log('Driver account created:', authData.user.email)

  const { data, error } = await supabase
    .from('drivers')
    .insert([{
      user_id: authData.user.id,
      full_name: 'Marcus Johnson',
      phone: '416-555-0192',
      vehicle_make: 'Toyota',
      vehicle_model: 'Camry',
      vehicle_year: 2022,
      license_plate: 'VOLT001',
      verification_status: 'pending',
      verified: false,
      is_online: false
    }])
    .select()

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Driver profile created:', data[0].full_name)
    console.log('Status:', data[0].verification_status)
  }
}

createDriver()