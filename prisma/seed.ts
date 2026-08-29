import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  })

  console.log('👤 Created demo user:', user.email)

  // Create sample transactions
  const transactions = [
    // Income transactions
    {
      type: 'income' as const,
      description: 'Gaji Bulan Januari',
      amount: 8500000,
      transactionDate: new Date('2024-01-05'),
      userId: user.id,
    },
    {
      type: 'income' as const,
      description: 'Bonus Proyek',
      amount: 2000000,
      transactionDate: new Date('2024-01-15'),
      userId: user.id,
    },
    {
      type: 'income' as const,
      description: 'Freelance Web Design',
      amount: 3500000,
      transactionDate: new Date('2024-01-20'),
      userId: user.id,
    },
    {
      type: 'income' as const,
      description: 'Gaji Bulan Februari',
      amount: 8500000,
      transactionDate: new Date('2024-02-05'),
      userId: user.id,
    },
    {
      type: 'income' as const,
      description: 'Dividen Investasi',
      amount: 1500000,
      transactionDate: new Date('2024-02-10'),
      userId: user.id,
    },
    
    // Expense transactions
    {
      type: 'expense' as const,
      description: 'Sewa Rumah',
      amount: 3000000,
      transactionDate: new Date('2024-01-01'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Belanja Bulanan',
      amount: 2500000,
      transactionDate: new Date('2024-01-03'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Listrik & Air',
      amount: 450000,
      transactionDate: new Date('2024-01-10'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Internet',
      amount: 350000,
      transactionDate: new Date('2024-01-12'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Bensin',
      amount: 500000,
      transactionDate: new Date('2024-01-15'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Makan di Restoran',
      amount: 350000,
      transactionDate: new Date('2024-01-18'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Belanja Pakaian',
      amount: 800000,
      transactionDate: new Date('2024-01-22'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Asuransi Kesehatan',
      amount: 500000,
      transactionDate: new Date('2024-01-25'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Sewa Rumah',
      amount: 3000000,
      transactionDate: new Date('2024-02-01'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Belanja Bulanan',
      amount: 2200000,
      transactionDate: new Date('2024-02-03'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Listrik & Air',
      amount: 420000,
      transactionDate: new Date('2024-02-10'),
      userId: user.id,
    },
    {
      type: 'expense' as const,
      description: 'Service Motor',
      amount: 250000,
      transactionDate: new Date('2024-02-12'),
      userId: user.id,
    },
  ]

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    })
  }

  console.log(`💰 Created ${transactions.length} sample transactions`)

  // Calculate and display summary
  const incomeCount = transactions.filter(t => t.type === 'income').length
  const expenseCount = transactions.filter(t => t.type === 'expense').length
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  console.log('\n📊 Summary:')
  console.log(`   Income: ${incomeCount} transactions, Total: Rp ${totalIncome.toLocaleString('id-ID')}`)
  console.log(`   Expense: ${expenseCount} transactions, Total: Rp ${totalExpense.toLocaleString('id-ID')}`)
  console.log(`   Profit: Rp ${(totalIncome - totalExpense).toLocaleString('id-ID')}`)
  
  console.log('\n✅ Seed completed successfully!')
  console.log('\n🔐 Login credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
