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