require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

app.get('/rides', async (req, res) => {
  const { data, error } = await supabase.from('rides').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.get('/rides/available', async (req, res) => {
  const { data, error } = await supabase.from('rides').select('*').eq('status', 'searching')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/rides', async (req, res) => {
  const { rider_name, pickup, dropoff, base_price, surge_multiplier, rider_id } = req.body
  const { data, error } = await supabase.from('rides').insert([{
    rider_name, pickup, dropoff, base_price, surge_multiplier,
    status: 'searching', rider_id
  }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.patch('/rides/:id/accept', async (req, res) => {
  const { id } = req.params
  const { driver_id } = req.body
  const { data, error } = await supabase.from('rides')
    .update({ driver_id, status: 'in_progress' })
    .eq('id', id).eq('status', 'searching').select()
  if (error) return res.status(500).json({ error: error.message })
  if (!data.length) return res.status(400).json({ error: 'Ride not available' })
  res.json(data[0])
})

app.patch('/rides/:id/complete', async (req, res) => {
  const { id } = req.params
  const { driver_id } = req.body
  const finalPrice = 12.00 * 1.5
  const platformFee = finalPrice * 0.03
  const driverEarnings = finalPrice - platformFee
  const { data, error } = await supabase.from('rides')
    .update({ status: 'completed' })
    .eq('id', id).eq('driver_id', driver_id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ride: data[0], financials: { final_price: finalPrice, platform_fee: platformFee, driver_earnings: driverEarnings } })
})

app.get('/drivers/:user_id', async (req, res) => {
  const { user_id } = req.params
  const { data, error } = await supabase.from('drivers').select('*').eq('user_id', user_id).single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET driver profile by user_id
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

// POST create driver profile
app.post('/drivers', async (req, res) => {
  const { data, error } = await supabase
    .from('drivers')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// PATCH update driver status (online/offline)
app.patch('/drivers/:user_id/status', async (req, res) => {
  const { user_id } = req.params
  const { is_online } = req.body
  const { data, error } = await supabase
    .from('drivers')
    .update({ is_online })
    .eq('user_id', user_id)
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// GET available vehicles for rent
app.get('/vehicles', async (req, res) => {
  const { data, error } = await supabase
    .from('vehicles_for_rent')
    .select('*')
    .eq('is_available', true)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST create a vehicle listing
app.post('/vehicles', async (req, res) => {
  const { data, error } = await supabase
    .from('vehicles_for_rent')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// GET payments for a user
app.get('/payments/:user_email', async (req, res) => {
  const { user_email } = req.params
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_email', user_email)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST create a payment
app.post('/payments', async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// POST submit a rating
app.post('/ratings', async (req, res) => {
  const { data, error } = await supabase
    .from('ratings')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// GET ratings for a driver
app.get('/ratings/:driver_email', async (req, res) => {
  const { driver_email } = req.params
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('driver_email', driver_email)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST create a rental
app.post('/rentals', async (req, res) => {
  const { data, error } = await supabase
    .from('rentals')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// GET rentals for a user
app.get('/rentals/:renter_email', async (req, res) => {
  const { renter_email } = req.params
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('renter_email', renter_email)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET notifications for a user
app.get('/notifications/:user_email', async (req, res) => {
  const { user_email } = req.params
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_email', user_email)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// PATCH mark notification as read
app.patch('/notifications/:id/read', async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// POST submit support ticket
app.post('/support', async (req, res) => {
  const { data, error } = await supabase
    .from('support')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// GET driver earnings history
app.get('/earnings/:driver_email', async (req, res) => {
  const { driver_email } = req.params
  const { data, error } = await supabase
    .from('driver_earnings_history')
    .select('*')
    .eq('driver_email', driver_email)
    .order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET charging stations
app.get('/charging-stations', async (req, res) => {
  const { data, error } = await supabase
    .from('charging_stations')
    .select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET active promotions
app.get('/promotions', async (req, res) => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST submit a dispute
app.post('/disputes', async (req, res) => {
  const { data, error } = await supabase
    .from('disputes')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

// GET messages for a ride
app.get('/messages/:ride_id', async (req, res) => {
  const { ride_id } = req.params
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('ride_id', ride_id)
    .order('created_at', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST send a message
app.post('/messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([req.body])
    .select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

app.listen(3000, () => console.log('Volt API running on port 3000'))
