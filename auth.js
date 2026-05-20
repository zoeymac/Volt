require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (error) {
        console.log('Signup error:', error.message)
    }
    else {
        console.log('User created:', data.user.email)
    }
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        console.log('Login error:', erroe.message)
    } else {
        console.log('Logged in:' , data.user.email)
        console.log('Token:' , data.session.access_token)
    }
    }
signUp('rider@volt.com', 'test1234')
signIn('rider@volt.com', 'test1234')

