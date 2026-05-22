require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// GET all rides
app.get('/rides', async (req, res) => {
  const { data, error } = await supabase
    .from('rides')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST a new ride
app.post('/rides', async (req, res) => {
  const { rider_name, pickup, dropoff, base_price, surge_multiplier, rider_id } = req.body

  const { data, error } = await supabase
    .from('rides')
    .insert([{
      rider_name,
      pickup,
      dropoff,
      base_price,
      surge_multiplier,
      status: 'searching',
      rider_id
    }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// Start server
app.listen(3000, () => {
  console.log('Volt API running on port 3000')
})
// GET available rides (for drivers)
app.get('/rides/available', async (req, res) => {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('status', 'searching')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// PATCH accept a ride (driver accepts)
app.patch('/rides/:id/accept', async (req, res) => {
  const { id } = req.params
  const { driver_id } = req.body

  const { data, error } = await supabase
    .from('rides')
    .update({ driver_id, status: 'in_progress' })
    .eq('id', id)
    .eq('status', 'searching')
    .select()

  if (error) return res.status(500).json({ error: error.message })
  if (!data.length) return res.status(400).json({ error: 'Ride not available' })
  res.json(data[0])
})

// PATCH complete a ride
app.patch('/rides/:id/complete', async (req, res) => {
  const { id } = req.params
  const { driver_id } = req.body

  const finalPrice = 12.00 * 1.5
  const platformFee = finalPrice * 0.03
  const driverEarnings = finalPrice - platformFee

  const { data, error } = await supabase
    .from('rides')
    .update({ status: 'completed' })
    .eq('id', id)
    .eq('driver_id', driver_id)
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json({
    ride: data[0],
    financials: {
      final_price: finalPrice,
      platform_fee: platformFee,
      driver_earnings: driverEarnings
    }
  })
})

// GET driver profile
app.get('/drivers/:user_id', async (req, res) => {
  const { user_id } = req.params
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})