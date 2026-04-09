const prisma = require('./src/utils/prisma');
async function test() {
  try {
    const user = await prisma.user.findFirst();
    console.log('User fetch success:', user ? 'Yes' : 'No users found');
  } catch (e) {
    console.error('User fetch failed:', e);
  } finally {
    process.exit();
  }
}
test();
