// Stop all running servers script
const { exec } = require('child_process');

console.log('🛑 Stopping all running servers...\n');

// Try different methods to stop Node processes
const commands = [
  'taskkill /IM "node.exe" /F',
  'wmic process where name="node.exe" delete',
  'powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"'
];

async function stopServers() {
  for (const command of commands) {
    try {
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.log(`❌ Command failed: ${command}`);
            console.log(`   Error: ${error.message}`);
            resolve(false);
          } else {
            console.log(`✅ Command succeeded: ${command}`);
            if (stdout) console.log(`   Output: ${stdout}`);
            if (stderr) console.log(`   ${stderr}`);
            resolve(true);
          }
        });
      });
    } catch (error) {
      console.log(`❌ Error executing: ${command}`);
      console.log(`   ${error.message}`);
    }
  }

  console.log('\n🔍 Checking if any servers are still running...');

  // Check if any Node processes are still running
  try {
    await new Promise((resolve) => {
      exec('tasklist | findstr node', (error, stdout, stderr) => {
        if (error || !stdout || stdout.trim() === '') {
          console.log('✅ No Node.js processes found running');
        } else {
          console.log('⚠️  Some Node.js processes may still be running:');
          console.log(stdout);
        }
        resolve(true);
      });
    });
  } catch (error) {
    console.log('✅ Server cleanup completed');
  }

  console.log('\n🎯 Server cleanup operation finished!');
  console.log('💡 If you need to start servers again, use:');
  console.log('   npm run dev    - Start development server');
  console.log('   npm run server - Start backend server');
  console.log('   npm run preview - Start production preview');
}

// Run the cleanup
stopServers().catch(console.error);
