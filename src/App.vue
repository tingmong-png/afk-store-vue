
<script setup>
import { ref } from 'vue'

const username = ref('')
const loading = ref(false)
const error = ref('')
const account = ref(null)

async function searchAccount() {
  const name = username.value.trim().replace(/^@/, '')
  error.value = ''
  account.value = null

  if (!name) {
    error.value = 'Please enter a Roblox username.'
    return
  }

  loading.value = true

  try {
    const response = await fetch(
  '/.netlify/functions/roblox-lookup',
  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Account not found.')

    account.value = data
  } catch (err) {
    error.value = err.message || 'Unable to search this account.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="store">
    <header class="navbar">
      <a class="logo" href="#home">✦ AFK STORE</a>
      <nav>
        <a href="#home">Home</a>
        <a href="#packages">Packages</a>
        <a href="#payment">Payment</a>
        <a href="#support">Support</a>
      </nav>
      <span class="status">● Store status: Preview</span>
    </header>

    <main id="home">
      <section class="hero">
        <div class="hero-left">
          <h1>LEVEL UP<br><span>YOUR GAME</span></h1>
          <p>A colorful, easy-to-use storefront for your gaming experience.</p>

          <div class="chips">
            <span>⚡ Simple experience</span>
            <span>🛡️ Clear order status</span>
            <span>🎧 Friendly support</span>
          </div>

          <div class="player-card">
            <span class="player-label">✦ AFK PLAYER</span>

            <div v-if="account" class="player-profile">
              <img :src="account.avatarUrl" alt="Roblox avatar" />
              <h2>{{ account.displayName }}</h2>
              <p>@{{ account.username }}</p>
              <small>Roblox User ID: {{ account.id }}</small>
            </div>

            <div v-else class="default-player">
              <div class="player-icon">🎮</div>
              <h2>YOUR NEXT LEVEL</h2>
              <p>Search your Roblox username to appear here.</p>
            </div>

            <span class="level-tag">LEVEL UP! ⚡</span>
          </div>
        </div>

        <div class="search-card">
          <h2>Find Your Roblox Account</h2>
          <p>Enter your Roblox username. You can type it with or without @.</p>

          <input
            v-model="username"
            placeholder="Enter Roblox username"
            @keyup.enter="searchAccount"
          />

          <button @click="searchAccount" :disabled="loading">
            {{ loading ? 'Searching...' : '⌕ Search Account' }}
          </button>

          <small>Never enter your Roblox password.</small>

          <p v-if="error" class="error">{{ error }}</p>

          <div v-if="account" class="account-result">
            <img :src="account.avatarUrl" alt="Roblox avatar" />
            <div>
              <strong>{{ account.displayName }}</strong>
              <p>@{{ account.username }}</p>
              <small>ID: {{ account.id }}</small>
            </div>
            <span class="check">✓</span>
          </div>
        </div>
      </section>

      <section id="packages" class="section">
        <h2>Choose Your Robux Package</h2>
        <div class="packages">
          <div v-for="item in [50, 100, 200, 300, 400, 500]" :key="item" class="package">
            <span class="coin">R$</span>
            <h3>{{ item }} Robux</h3>
            <p>${{ (item / 100).toFixed(2) }}</p>
            <small>Available preview</small>
          </div>
        </div>
      </section>

      <section id="payment" class="section">
        <h2>Payment Options</h2>
        <p>ABA Bank and KHQR payment setup coming soon.</p>
      </section>

      <section id="support" class="section">
        <h2>AFK Store Support</h2>
        <p>Customer support information coming soon.</p>
      </section>
    </main>

    <footer>✦ AFK STORE · Homepage Preview · 2026</footer>
  </div>
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #08091d; color: white; }
.store { min-height: 100vh; background: #08091d; }
.navbar { min-height: 76px; padding: 18px 7%; display: flex; align-items: center; justify-content: space-between; gap: 20px; background: #0c0c24; border-bottom: 1px solid #292747; }
.logo { color: white; font-size: 25px; font-weight: 900; text-decoration: none; }
nav { display: flex; gap: 28px; }
nav a { color: #dddaf2; text-decoration: none; font-weight: bold; }
.status { color: #65edc2; border: 1px solid #168c75; border-radius: 30px; padding: 12px 18px; font-size: 13px; }
.hero { padding: 75px 7%; display: grid; grid-template-columns: 1.1fr .9fr; gap: 55px; align-items: center; background: radial-gradient(circle at 5% 20%, #172f68, transparent 42%), radial-gradient(circle at 95% 30%, #50105b, transparent 45%); }
.hero-left h1 { font-size: clamp(48px, 6vw, 86px); line-height: .98; margin: 0 0 24px; font-weight: 950; }
.hero-left h1 span { background: linear-gradient(90deg, #4bd9ff, #a15cff, #f14acb); color: transparent; background-clip: text; }
.hero-left > p, .search-card > p { color: #c3c5e7; line-height: 1.7; font-size: 18px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 28px 0; }
.chips span { padding: 13px 17px; border: 1px solid #414166; background: #ffffff0b; border-radius: 30px; font-size: 13px; }
.player-card, .search-card { border: 1px solid #8750c7; background: #ffffff0c; border-radius: 28px; padding: 30px; }
.player-card { min-height: 330px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 45px; }
.player-label, .level-tag { position: absolute; padding: 13px 17px; border: 1px solid #51416e; border-radius: 18px; background: #17152e; font-weight: bold; color: #65dfff; }
.player-label { top: 18px; left: 18px; }
.level-tag { bottom: 15px; right: 18px; color: #ff72d9; }
.default-player, .player-profile { text-align: center; }
.player-icon { font-size: 75px; }
.player-profile {
  width: 100%;
  text-align: center;
  padding: 35px 0 30px;
  position: relative;
  z-index: 1;
}

.player-profile img {
  width: 115px;
  height: 115px;
  border-radius: 22px;
  object-fit: cover;
  border: 2px solid #8750c7;
  box-shadow: 0 8px 25px #00000055;
}

.player-profile h2 {
  color: #ffffff;
  font-size: 24px;
  margin: 14px 0 6px;
}

.player-profile p {
  color: #65dfff;
  margin: 5px 0;
}

.player-profile small {
  display: block;
  color: #bfc5e8;
  margin-top: 8px;
  font-size: 12px;
}

.level-tag {
  z-index: 2;
}
.search-card h2 { font-size: 28px; }
.search-card input { width: 100%; padding: 19px; border: 1px solid #9a55e7; border-radius: 16px; background: #0c102a; color: white; font-size: 17px; margin: 12px 0; }
.search-card button { width: 100%; padding: 18px; border: 0; border-radius: 16px; background: linear-gradient(90deg, #6535ff, #d522d0); color: white; font-size: 18px; font-weight: bold; cursor: pointer; }
.search-card button:disabled { opacity: .6; }
.search-card > small { display: block; margin-top: 13px; color: #bfc5e8; }
.error { color: #ff829e !important; }
.account-result { margin-top: 22px; padding: 17px; border: 1px solid #12d9a3; border-radius: 18px; display: flex; align-items: center; gap: 15px; background: #102337; }
.account-result img { width: 65px; height: 65px; border-radius: 15px; object-fit: cover; }
.account-result p, .account-result small { color: #c0c7e8; margin: 5px 0; }
.check { margin-left: auto; color: #19e4a7; font-size: 28px; }
.section { padding: 55px 7%; }
.section h2 { font-size: 30px; }
.packages { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.package { padding: 25px; border: 1px solid #51416e; border-radius: 20px; background: #17152e; text-align: center; }
.coin { display: inline-grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; background: #ffc83d; color: #654000; font-weight: 900; }
.package p { color: #f5b9ff; }
.package small, footer { color: #aaaed1; }
footer { padding: 30px; text-align: center; border-top: 1px solid #292747; }
@media (max-width: 800px) {
  .navbar { flex-wrap: wrap; }
  nav { order: 3; width: 100%; flex-wrap: wrap; gap: 15px; }
  .hero { grid-template-columns: 1fr; padding: 45px 6%; }
  .packages { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 450px) {
  .packages { grid-template-columns: 1fr; }
  .search-card, .player-card { padding: 22px; }
}
</style>
