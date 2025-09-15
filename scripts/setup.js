#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AI CoFounder Setup Script');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database
MONGO_URI=mongodb://localhost:27017/ai_cofounder

# Google AI Studio API Key (Get from https://aistudio.google.com/)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# JWT Secret (Generate a random string)
JWT_SECRET=your_jwt_secret_here

# App Environment
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created!');
  console.log('⚠️  Please update the API keys in .env.local before running the app.\n');
} else {
  console.log('✅ .env.local file already exists.\n');
}

// Check if MongoDB is running
console.log('📊 Database Setup:');
console.log('   - Make sure MongoDB is running on your system');
console.log('   - Default connection: mongodb://localhost:27017/ai_cofounder');
console.log('   - The app will create collections automatically\n');

// Check Google AI Studio setup
console.log('🤖 AI Setup:');
console.log('   1. Go to https://aistudio.google.com/');
console.log('   2. Create a new project');
console.log('   3. Generate an API key');
console.log('   4. Add the key to your .env.local file\n');

console.log('🎯 Next Steps:');
console.log('   1. Update .env.local with your API keys');
console.log('   2. Start MongoDB service');
console.log('   3. Run: npm run dev');
console.log('   4. Open: http://localhost:3000\n');

console.log('📚 Features Available:');
console.log('   ✅ Startup Ideation with AI');
console.log('   ✅ Business Planning & Lean Canvas');
console.log('   ✅ Pitch Deck Generation');
console.log('   ✅ Financial Modeling');
console.log('   ✅ MVP Feature Planning');
console.log('   ✅ Code Generation');
console.log('   ✅ Investor Pitch Simulation');
console.log('   ✅ Learning Paths & Mentorship');
console.log('   ✅ Community Q&A');
console.log('   ✅ Cold Email Templates\n');

console.log('🎉 Setup complete! Happy building!');





